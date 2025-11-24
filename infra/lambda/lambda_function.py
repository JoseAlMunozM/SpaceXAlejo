import json
import boto3
import urllib.request
import os

TABLE = os.environ["DYNAMODB_TABLE"]
dynamo = boto3.resource("dynamodb")
table = dynamo.Table(TABLE)

def lambda_handler(event, context):

    # Respuesta a OPTIONS (CORS) para consumos correctos de el backend 
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "GET,OPTIONS"
            },
            "body": ""
        }

    # Invocación GET normal usando el request con un cors incluido para las validaciones 
    url = "https://api.spacexdata.com/v4/launches"

    with urllib.request.urlopen(url) as response:
        launches = json.loads(response.read().decode())

    count = 0
    for launch in launches:
        item = {
            "id": launch.get("id"),
            "mission_name": launch.get("name"),
            "launch_date": launch.get("date_utc"),
            "rocket_name": launch.get("rocket"),
            "success": str(launch.get("success")),
            "details": launch.get("details"),
        }
        table.put_item(Item=item)
        count += 1

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS"
        },
        "body": json.dumps({
            "message": "Datos procesados correctamente",
            "items_written": count
        })
    }
