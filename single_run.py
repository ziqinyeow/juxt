import json

from rtm.kinematics.kinematics_v2 import Angle, Kinematics, Point

# read json file
with open('validation/BikeFit - Side.json') as f:
    config = json.load(f)

pointO = config['data']['timeseries'][0]['data']['o']
pointA = config['data']['timeseries'][0]['data']['a']
pointB = config['data']['timeseries'][0]['data']['b']
framerate = config['metadata']['captureFramerate']

pointO = Point(data=pointO, joint_name='pointO', fps=framerate)
pointA = Point(data=pointA, joint_name='pointA', fps=framerate)
pointB = Point(data=pointB, joint_name='pointB', fps=framerate)

angle_1 = Angle(angle_name='angle_1', dependencies=[pointA, pointO, pointB])
# angle_1 = Angle(angle_name='angle_1')
# angle_1.loadFromJson(data={'a': pointA, 'o': pointO,
#                      'b': pointB}, fps=framerate)
angle_1.compute()


pointO_metrics = pointO.get_metrics()
# print(len(pointO_metrics['time']))
# print(len(pointO_metrics['metrics']['speed_no_smooth']))


pointO.export(human_dir='./validation')
pointA.export(human_dir='./validation')
pointB.export(human_dir='./validation')
angle_1.export(human_dir='./validation')
