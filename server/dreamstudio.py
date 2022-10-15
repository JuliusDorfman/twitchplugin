import io
import os, sys
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
from IPython.display import display
from dotenv import load_dotenv

keysFile = os.path.join('./', '.env')
load_dotenv(keysFile)
DREAM_STUDIO_KEY = os.getenv('DREAM_STUDIO_KEY')

os.chdir(os.path.dirname(os.path.realpath(__file__)))

promptAppender = ["4k", "detailed", "dark fantasy", 
                   "concept art", "illustration", "cyberpunk", 
                   "trending on art station", "elegant", "digital painting"]

stability_api = client.StabilityInference(
    key=DREAM_STUDIO_KEY,
    verbose=True,
    )

# prompt="frog girl fighting demon hawks on a boat"

prompt = str(sys.argv[1])

answers = stability_api.generate(prompt)

for resp in answers:
    for artifact in resp.artifacts:
        if artifact.finish_reason == generation.FILTER:
            warnings.warn(
                "Your request activated the API's safety filters and could not be processed."
                "Please modify the prompt and try again.")
        if artifact.type == generation.ARTIFACT_IMAGE:
            img = Image.open(io.BytesIO(artifact.binary))
            # img = Image.save(io.BytesIO(artifact.binary))
            display(img)

# Create an image counter that resets at the end of the day
            num = random.randrange(1, 100)
            today = datetime.now().strftime("%m%d%y%h%m")
            promptSubstr = prompt.replace(" ", "")

            if len(promptSubstr) > 5:
                promptSubstr = promptSubstr[0:5]

            savedFileName = f'{today}-{promptSubstr}-{num}.png'

            os.chdir('./generatedimages')
            img.save(savedFileName)
            print(savedFileName)

