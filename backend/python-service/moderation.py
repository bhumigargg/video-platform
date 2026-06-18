from flask import Flask, request
from nudenet import NudeDetector

app = Flask(__name__)

detector = NudeDetector()

@app.route("/moderate", methods=["POST"])
def moderate():

    image_path = request.json["image"]

    result = detector.detect(image_path)

    flagged = any(
        item["score"] > 0.6
        for item in result
    )

    return {
        "sensitivity":
        "flagged"
        if flagged
        else "safe"
    }

app.run(
    host="0.0.0.0",
    port=5001
)