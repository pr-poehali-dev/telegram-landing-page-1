'''
Business: API для управления постами Telegram канала (получение, создание, обновление, удаление)
Args: event - dict с httpMethod, body, queryStringParameters, pathParams
      context - object с атрибутами request_id, function_name
Returns: HTTP response dict с постами в JSON формате
'''

import json
import os
from typing import Dict, Any, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Создает подключение к базе данных"""
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # GET /posts - получить все посты
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
        
        # POST /posts - создать новый пост
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            title = body_data.get('title', '')
            preview = body_data.get('preview', '')
            image_url = body_data.get('image_url', '')
            reactions = json.dumps(body_data.get('reactions', {}))
            views = body_data.get('views', 0)
            
            cur.execute('''
                INSERT INTO posts (title, preview, image_url, reactions, views)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, title, preview, image_url, reactions, views, created_at, updated_at
            ''', (title, preview, image_url, reactions, views))
            
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
        
        # PUT /posts/:id - обновить пост
        elif method == 'PUT':
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
                RETURNING id, title, preview, image_url, reactions, views, created_at, updated_at
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
        
        # DELETE /posts/:id - удалить пост
        elif method == 'DELETE':
            path_params = event.get('pathParams', {})
            post_id = path_params.get('id')
            
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