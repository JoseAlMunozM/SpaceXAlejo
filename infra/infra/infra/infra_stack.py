from aws_cdk import (
    Stack,
    Duration,
    RemovalPolicy,
    aws_dynamodb as dynamodb,
    aws_lambda as lambda_,
    aws_events as events,
    aws_events_targets as targets,
    aws_apigateway as apigateway
)
from constructs import Construct


class InfraStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # ============================================================
        # 1. DynamoDB
        # ============================================================
        self.table = dynamodb.Table(
            self,
            "SpaceXLaunchesTable",
            partition_key=dynamodb.Attribute(
                name="id",
                type=dynamodb.AttributeType.STRING
            ),
            removal_policy=RemovalPolicy.DESTROY
        )

        # ============================================================
        # 2. Lambda IMPORT (actualiza BD)
        # ============================================================
        self.lambda_import = lambda_.Function(
            self,
            "SpaceXImportLambda",
            runtime=lambda_.Runtime.PYTHON_3_10,
            handler="lambda_function.lambda_handler",
            code=lambda_.Code.from_asset("../lambda/lambda_import"),
            timeout=Duration.minutes(2),
            environment={
                "DYNAMODB_TABLE": self.table.table_name
            }
        )

        self.table.grant_read_write_data(self.lambda_import)

        events.Rule(
            self,
            "SpaceXImportScheduleRule",
            schedule=events.Schedule.rate(Duration.hours(6)),
            targets=[targets.LambdaFunction(self.lambda_import)]
        )

        # ============================================================
        # 3. Lambda API (solo lectura)
        # ============================================================
        self.lambda_api = lambda_.Function(
            self,
            "SpaceXApiLambda",
            runtime=lambda_.Runtime.PYTHON_3_10,
            handler="lambda_function.lambda_handler",
            code=lambda_.Code.from_asset("../lambda/lambda_api"),
            timeout=Duration.seconds(30),
            environment={
                "DYNAMODB_TABLE": self.table.table_name
            }
        )

        self.table.grant_read_data(self.lambda_api)

        # ============================================================
        # 4. API Gateway
        # ============================================================
        api = apigateway.LambdaRestApi(
            self,
            "SpaceXApiGateway",
            handler=self.lambda_api,
            proxy=True,
            default_cors_preflight_options=apigateway.CorsOptions(
                allow_origins=apigateway.Cors.ALL_ORIGINS,
                allow_methods=apigateway.Cors.ALL_METHODS,
                allow_headers=["*"]
            ),
            deploy_options=apigateway.StageOptions(stage_name="prod")
        )

        self.api_url = api.url
