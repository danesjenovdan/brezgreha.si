import os
import uuid
from flask import Flask, flash, request, redirect, jsonify, render_template
from flask_cors import CORS

UPLOAD_FOLDER = 'static/files'

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET'])
def getStones():
    with open('/app/stones.txt', 'r') as infile:
        number_of_stones = infile.readlines()[0].strip()
        return jsonify({
            'kamnov': number_of_stones
        })

@app.route('/', methods=['POST'])
def throwStone():
    number_of_stones = 0
    with open('/app/stones.txt', 'r') as infile:
        number_of_stones = int(infile.readlines()[0].strip()) + 1
    with open('/app/stones.txt', 'w') as outfile:
        outfile.write(str(number_of_stones))

    return jsonify({
        'kamnov': number_of_stones
    })

if __name__ == '__main__':
    app.run()
