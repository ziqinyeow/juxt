import csv
import time
from io import StringIO
from pathlib import Path

import pandas as pd
import plotly.express as px
import plotly.graph_objs as go
from plotly.subplots import make_subplots
from sklearn import metrics

import streamlit as st
from rtm.kinematics.constants import BODY_JOINTS_MAP
from rtm.kinematics.kinematics_v2 import Kinematics, PointMetricsMapping

REVERSE_BODY_JOINTS_MAP = {v: k for k, v in BODY_JOINTS_MAP.items()}

# Streamlit Configuration
st.set_page_config(page_title="Kinematics Dashboard", layout="wide")

# Upload Data Section
st.title("Upload Data")
uploaded_file = st.file_uploader("Upload CSV Data", type=["csv"])

if uploaded_file is not None:
    file = StringIO(uploaded_file.getvalue().decode("utf-8"))
    # Process Data
    kinematics = Kinematics(run_path=file)

    # Options Section
    st.sidebar.title("Options")
    filtering = st.sidebar.checkbox("Enable Filtering", value=True)
    preprocess_smoothing = st.sidebar.checkbox(
        "Enable Preprocess Smoothing", value=True)
    smoothing = st.sidebar.checkbox("Enable Smoothing", value=True)

    time_vs_frame = st.sidebar.selectbox(
        "Time or Frame", ['Time', 'Frame'], placeholder='Time')
    x_meter_per_pixel = st.sidebar.number_input(
        "X Meter per Pixel Calibration", value=1.0)
    y_meter_per_pixel = st.sidebar.number_input(
        "Y Meter per Pixel Calibration", value=1.0)

    # Associate Human Profiles
    associate_human_profile = st.sidebar.multiselect(
        "Associate Human Profiles", kinematics.profileSet.keys())
    onlyHumanProfile = st.sidebar.selectbox(
        "Only Human Profile", kinematics.profileSet.keys())

    # Filter Data
    filter_data_body_joints = st.sidebar.multiselect(
        "Body Joints", BODY_JOINTS_MAP.values())

    # Add in metrics filter
    joint_metrics_filter = st.sidebar.multiselect(
        "Metrics", list(PointMetricsMapping.keys()))

    # Compute Data and Display Interactive Charts
    st.title("Compute Data and Display Charts")
    st.write("Processing data...")
    start_time = time.time()
    kinematics(save=False, filter_on=filtering, interpolate_on=True,
               associate_human_profile=[associate_human_profile], onlyHumanProfile=[onlyHumanProfile], preprocess_smoothing_on=preprocess_smoothing, smoothing_on=smoothing)

    end_time = time.time()
    processing_time = end_time - start_time  # Calculate elapsed time
    st.write(f"Kinematics processing time: {processing_time:.2f} seconds")

    # Display Interactive Charts
    for human_idx, profile in kinematics.profileSet.items():

        selected_body_joints = list(profile.body_joints.keys()) if len(
            filter_data_body_joints) == 0 else [REVERSE_BODY_JOINTS_MAP[name] for name in filter_data_body_joints]

        body_joints = [joint for i, joint in profile.body_joints.items(
        ) if i in selected_body_joints]

        st.subheader(f"Human Profile {human_idx}")
        for joint in body_joints:
            joint_full_info = joint.get_metrics()
            st.write(joint_full_info['metadata']['name'])

            joint_full_info = joint.get_metrics()
            # print(len(joint_full_info['metrics']['y_speed']))
            # print(len(joint_full_info['time']))

            selected_metrics = [
                metric_name for metric_name in joint_full_info['metrics'].keys() if metric_name in joint_metrics_filter]
            selected_metrics = list(joint_full_info['metrics'].keys()) if len(
                selected_metrics) == 0 else selected_metrics

            # Create subplots with 2 columns and dynamic number of rows
            num_rows = len(selected_metrics) // 2 + (len(selected_metrics) % 2)
            num_rows = 1 if num_rows == 0 else num_rows
            fig = make_subplots(rows=num_rows, cols=2, subplot_titles=list(
                joint_full_info['metrics_info'].keys()))

            row, col = 1, 1
            for metric_name in selected_metrics:
                # print(metric_name)
                chart_data = {
                    "Frame" if time_vs_frame == 'Frame' else "Time": list(range(len(joint_full_info['time']))) if time_vs_frame == 'Frame' else joint_full_info['time'],
                    metric_name: joint_full_info['metrics'][metric_name]
                }
                print(metric_name)
                print(len(chart_data[metric_name]), len(chart_data["Time"]))

                chart_df = pd.DataFrame(chart_data)
                trace = go.Scatter(x=chart_df["Frame" if time_vs_frame == 'Frame' else "Time"],
                                   y=chart_df[metric_name],
                                   name=f"{metric_name}")
                # Set the y-axis title for the trace
                y_axis_title = joint_full_info['metrics_info'][metric_name]['Unit']
                fig.update_yaxes(title_text=y_axis_title, row=row, col=col)
                fig.add_trace(trace, row=row, col=col)
                # fig.update_layout(title={"text": "Metric Charts", "x": 0.5, "xanchor": "center"})

                col += 1
                if col > 2:
                    col = 1
                    row += 1
            fig.update_xaxes(
                title_text="Time (s)" if time_vs_frame == 'Time' else "Frame")

            fig.update_layout(title="Metric Charts", showlegend=False)
            st.plotly_chart(fig)
