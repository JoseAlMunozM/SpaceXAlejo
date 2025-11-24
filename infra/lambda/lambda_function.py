import json
import boto3
import urllib.request
import os

TABLE = os.environ["DYNAMODB_TABLE"]
dynamo = boto3.resource("dynamodb")
table = dynamo.Table(TABLE)

def lambda_handler(event, context):
    url = "https://api.spacexdata.com/v4/launches"

    # Consumimos la API sin requests (Lambda-friendly)
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
        "body": json.dumps({
            "message": "Datos procesados correctamente",
            "items_written": count
        })
    }
