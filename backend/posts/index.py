'''
Business: API для управления постами Telegram канала (получение, создание, обновление, удаление)
Args: event - dict с httpMethod, body, queryStringParameters, pathParams
      context - object с атрибутами request_id, function_name
Returns: HTTP response dict с постами в JSON формате
'''

import json
import os
import jwt
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Создает подключение к базе данных"""
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def verify_jwt_token(token: str) -> bool:
    """Проверяет JWT токен"""
    try:
        secret = os.environ.get('JWT_SECRET', 'default-secret-key')
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        print(f"JWT verified for user: {payload.get('username')}")
        return True
    except jwt.ExpiredSignatureError:
        print("JWT expired")
        return False
    except Exception as e:
        print(f"JWT error: {e}")
        return False

def create_jwt_token(username: str) -> str:
    """Создает JWT токен"""
    secret = os.environ.get('JWT_SECRET', 'default-secret-key')
    payload = {
        'username': username,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, secret, algorithm='HS256')

def check_credentials(username: str, password: str) -> bool:
    """Проверяет логин и пароль"""
    expected_username = os.environ.get('ADMIN_USERNAME', 'admin')
    expected_password = os.environ.get('ADMIN_PASSWORD', 'admin')
    return username == expected_username and password == expected_password

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # GET /posts - получить все посты (публичный доступ)
        if method == 'GET':
            path_params = event.get('pathParams', {})
            post_id = path_params.get('id')
            
            if post_id:
                # Получить один пост
                cur.execute('SELECT * FROM posts WHERE id = %s', (post_id,))
                post = cur.fetchone()
                
                if not post:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Post not found'}),
                        'isBase64Encoded': False
                    }
                
                result = dict(post)
                result['created_at'] = result['created_at'].isoformat()
                result['updated_at'] = result['updated_at'].isoformat()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(result),
                    'isBase64Encoded': False
                }
            else:
                # Получить все посты
                cur.execute('SELECT * FROM posts ORDER BY created_at DESC')
                posts = cur.fetchall()
                
                result = []
                for post in posts:
                    post_dict = dict(post)
                    post_dict['created_at'] = post_dict['created_at'].isoformat()
                    post_dict['updated_at'] = post_dict['updated_at'].isoformat()
                    result.append(post_dict)
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(result),
                    'isBase64Encoded': False
                }
        
        # POST /posts - создать новый пост (требует авторизации)
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            # Если это запрос логина
            if body_data.get('action') == 'login':
                username = body_data.get('username')
                password = body_data.get('password')
                
                if not check_credentials(username, password):
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid credentials'}),
                        'isBase64Encoded': False
                    }
                
                token = create_jwt_token(username)
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'token': token}),
                    'isBase64Encoded': False
                }
            
            # Проверяем JWT токен
            auth_header = event.get('headers', {}).get('x-auth-token') or event.get('headers', {}).get('X-Auth-Token')
            if not auth_header or not auth_header.startswith('Bearer '):
                print(f"No Bearer token. Headers: {list(event.get('headers', {}).keys())}")
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Unauthorized'}),
                    'isBase64Encoded': False
                }
            
            token = auth_header.split(' ', 1)[1]
            if not verify_jwt_token(token):
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'WWW-Authenticate': 'Basic realm="Admin Area"'
                    },
                    'body': json.dumps({'error': 'Unauthorized'}),
                    'isBase64Encoded': False
                }
            
            title = body_data.get('title', '')
            preview = body_data.get('preview', '')
            image_url = body_data.get('image_url', '')
            post_url = body_data.get('post_url', '')
            reactions = json.dumps(body_data.get('reactions', {}))
            views = body_data.get('views', 0)
            
            cur.execute('''
                INSERT INTO posts (title, preview, image_url, post_url, reactions, views)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id, title, preview, image_url, post_url, reactions, views, created_at, updated_at
            ''', (title, preview, image_url, post_url, reactions, views))
            
            post = cur.fetchone()
            conn.commit()
            
            result = dict(post)
            result['created_at'] = result['created_at'].isoformat()
            result['updated_at'] = result['updated_at'].isoformat()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        # PUT /posts/:id - обновить пост (требует авторизации)
        elif method == 'PUT':
            auth_header = event.get('headers', {}).get('x-auth-token') or event.get('headers', {}).get('X-Auth-Token')
            if not auth_header or not auth_header.startswith('Bearer '):
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Unauthorized'}),
                    'isBase64Encoded': False
                }
            
            token = auth_header.split(' ', 1)[1]
            if not verify_jwt_token(token):
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'WWW-Authenticate': 'Basic realm="Admin Area"'
                    },
                    'body': json.dumps({'error': 'Unauthorized'}),
                    'isBase64Encoded': False
                }
            path_params = event.get('pathParams', {})
            post_id = path_params.get('id')
            
            if not post_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Post ID is required'}),
                    'isBase64Encoded': False
                }
            
            body_data = json.loads(event.get('body', '{}'))
            
            title = body_data.get('title')
            preview = body_data.get('preview')
            image_url = body_data.get('image_url')
            post_url = body_data.get('post_url')
            reactions = json.dumps(body_data.get('reactions')) if body_data.get('reactions') else None
            views = body_data.get('views')
            
            # Строим динамический UPDATE запрос
            update_fields = []
            update_values = []
            
            if title is not None:
                update_fields.append('title = %s')
                update_values.append(title)
            if preview is not None:
                update_fields.append('preview = %s')
                update_values.append(preview)
            if image_url is not None:
                update_fields.append('image_url = %s')
                update_values.append(image_url)
            if post_url is not None:
                update_fields.append('post_url = %s')
                update_values.append(post_url)
            if reactions is not None:
                update_fields.append('reactions = %s')
                update_values.append(reactions)
            if views is not None:
                update_fields.append('views = %s')
                update_values.append(views)
            
            update_fields.append('updated_at = NOW()')
            update_values.append(post_id)
            
            query = f'''
                UPDATE posts 
                SET {', '.join(update_fields)}
                WHERE id = %s
                RETURNING id, title, preview, image_url, post_url, reactions, views, created_at, updated_at
            '''
            
            cur.execute(query, update_values)
            post = cur.fetchone()
            conn.commit()
            
            if not post:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Post not found'}),
                    'isBase64Encoded': False
                }
            
            result = dict(post)
            result['created_at'] = result['created_at'].isoformat()
            result['updated_at'] = result['updated_at'].isoformat()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        # DELETE /posts?id=X - удалить пост (требует авторизации)
        elif method == 'DELETE':
            auth_header = event.get('headers', {}).get('x-auth-token') or event.get('headers', {}).get('X-Auth-Token')
            if not auth_header or not auth_header.startswith('Bearer '):
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Unauthorized'}),
                    'isBase64Encoded': False
                }
            
            token = auth_header.split(' ', 1)[1]
            if not verify_jwt_token(token):
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'WWW-Authenticate': 'Basic realm="Admin Area"'
                    },
                    'body': json.dumps({'error': 'Unauthorized'}),
                    'isBase64Encoded': False
                }
            query_params = event.get('queryStringParameters', {})
            post_id = query_params.get('id')
            
            if not post_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Post ID is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('DELETE FROM posts WHERE id = %s RETURNING id', (post_id,))
            deleted = cur.fetchone()
            conn.commit()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Post not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Post deleted successfully'}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()