#from segmentor import segmentorFunction

def process(audio_file):
    segments = segment(audio_file)
    duration = 4730

    data = { "id": 0,
             "label": "Test Generated Clip",
             "audio_url": "http://",
             "duration": duration,
             "segements": segments,
            }
    return str(data)

def segment(audio_file):
    json = segmentorFunction(audio_file)
    #json = format(json)

    return json

def segmentorFunction(audio_file):
    return [{
                "start": 0.000,
                "end": 7.1239,
                "speaker": "1",
                "annotation": "",
            },
            {
                "start": 8.2383,
                "end": 14.2395,
                "speaker": "2",
                "annotation": "",
            },
            {
                "start": 16.2333,
                "end": 19.2395,
                "speaker": "",
                "annotation": "",
            },
            {
                "start": 22.2333,
                "end": 27.2395,
                "speaker": "",
                "annotation": "",
            },
            {
                "start": 28.2333,
                "end": 35.2395,
                "speaker": "",
                "annotation": "",
            },
            {
                "start": 36.2333,
                "end": 39.2395,
                "speaker": "",
                "annotation": "",
            },
            {
                "start": 42.2333,
                "end": 45.2395,
                "speaker": "",
                "annotation": "",
            },
            {
                "start": 47.2333,
                "end": 52.2395,
                "speaker": "",
                "annotation": "",
            },
            {
                "start": 53.2333,
                "end": 62.2395,
                "speaker": "",
                "annotation": "",
            },
            {
                "start": 62.2333,
                "end": 69.2395,
                "speaker": "",
                "annotation": "",
            },
            {
                "start": 73.2333,
                "end": 78.2395,
                "speaker": "",
                "annotation": "",
            },
            {
                "start": 81.2333,
                "end": 83.2395,
                "speaker": "",
                "annotation": "",
            },
            {
                "start": 84.2333,
                "end": 87.2395,
                "speaker": "",
                "annotation": "",
            },
            {
                "start": 87.2333,
                "end": 111.2395,
                "speaker": "",
                "annotation": "",
            },
        ]
