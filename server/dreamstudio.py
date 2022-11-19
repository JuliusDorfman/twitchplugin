import io
import os, sys
# from tkinter.tix import DirSelectDialog
import warnings
from PIL import Image
from array import array
import random 
from datetime import datetime
import numpy as np
from simple_chalk import chalk
from stability_sdk import client
import stability_sdk.interfaces.gooseai.generation.generation_pb2 as generation
from environs import Env
from dotenv import load_dotenv
import boto3
from botocore.exceptions import NoCredentialsError

keysFile = os.path.join('./', '.env')
load_dotenv(keysFile)

heroku_env = False
if 'ON_HEROKU_ENVIRONMENT' in os.environ:
    heroku_env = True

if heroku_env == False:
    DREAM_STUDIO_KEY = os.getenv['DREAM_STUDIO_KEY']
    AMZ_ACCESS_KEY = os.getenv['AMZ_ACCESS_KEY']
    AMZ_SECRET_KEY = os.getenv['AMZ_SECRET_KEY']
else:
    DREAM_STUDIO_KEY = os.environ['DREAM_STUDIO_KEY']
    AMZ_ACCESS_KEY = os.environ['AMZ_ACCESS_KEY']
    AMZ_SECRET_KEY = os.environ['AMZ_SECRET_KEY']
    

os.chdir(os.path.dirname(os.path.realpath(__file__)))

promptAppender = ["4k", "detailed", "dark fantasy", 
                   "concept art", "illustration", "cyberpunk", 
                   "trending on art station", "elegant", "digital painting"]

stability_api = client.StabilityInference(
    key=DREAM_STUDIO_KEY,
    verbose=True,
    )



# testing
# savedFileName = "100822Oct10-green-61.png"
# prompt="frog girl fighting demon hawks on a boat"
# testing 

prompt = str(sys.argv[1])

answers = stability_api.generate(prompt)

for resp in answers:
    for artifact in resp.artifacts:
        if artifact.finish_reason == generation.FILTER:
            warnings.warn(
                "Your request activated the API's safety filters and could not be processed."
                "Please modify the prompt and try again.")
            print("NSFW")
            exit()
        if artifact.type == generation.ARTIFACT_IMAGE:
            img = Image.open(io.BytesIO(artifact.binary))
            # img = Image.save(io.BytesIO(artifact.binary))
            # Create an image counter that resets at the end of the day

            num = random.randrange(1, 100)
            today = datetime.now().strftime("%m%d%y%h%m")
            promptSubstr = prompt.replace(" ", "")

            if len(promptSubstr) > 5:
                promptSubstr = promptSubstr[0:5]
                
            savedFileName = f'{today}-{promptSubstr}-{num}.png'
   
            os.chdir('./generatedimages')
            img.save(savedFileName)
            # print(savedFileName)

def upload_to_aws(local_file, bucket, s3_file):
    s3 = boto3.client('s3', 
                      aws_access_key_id=AMZ_ACCESS_KEY,
                      aws_secret_access_key=AMZ_SECRET_KEY,
                      region_name="us-west-1") 

    try:
        s3.upload_file(local_file, bucket, s3_file, ExtraArgs={
                        "ACL": "public-read",
                        "ContentType": "image/png"
                        })
        # print("Upload Successful")
        return True
    except FileNotFoundError:
        # print("The file was not found")
        return False
    except NoCredentialsError:
        # print("Credentials not available")
        return False



uploaded = upload_to_aws(savedFileName, 'stateoftwitchart', savedFileName)



publicURL = f'https://stateoftwitchart.s3.us-west-1.amazonaws.com/{savedFileName}'
print(publicURL)