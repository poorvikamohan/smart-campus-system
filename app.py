from flask import Flask, render_template, request, jsonify
import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

app = Flask(__name__)

students = {}


# --------------------------------
# Home Page
# --------------------------------

@app.route('/')
def home():
    return render_template('index.html')


# --------------------------------
# Register Student
# --------------------------------

# --------------------------------
# Register Student
# --------------------------------
@app.route('/register', methods=['POST'])
def register():

    data = request.json

    sid = data['sid']
    name = data['name']
    marks = int(data['marks'])

    if marks >= 90:
        grade = 'A'

    elif marks >= 75:
        grade = 'B'

    elif marks >= 50:
        grade = 'C'

    else:
        grade = 'Fail'

    students[sid] = {
        "Name": name,
        "Marks": marks,
        "Grade": grade,
        "Course": "Not Assigned",
        "Hostel Fee": 0,
        "Mess Fee": 0
    }

    return jsonify({
        "message": "Student Registered Successfully!"
    })

    

# --------------------------------
# Course Registration
# --------------------------------

# --------------------------------
# Course Enrollment
# --------------------------------
@app.route('/course', methods=['POST'])
def course():

    data = request.json

    sid = data['sid']
    course_name = data['course']

    if sid in students:

        students[sid]['Course'] = course_name

        return jsonify({
            "message": "Course Added Successfully!"
        })

    return jsonify({
        "message": "Student Not Found!"
    })



# --------------------------------
# Hostel and Mess Fee
# --------------------------------
# Hostel and Mess Fee
# --------------------------------
@app.route('/hostel_fee', methods=['POST'])
def hostel_fee():

    data = request.json

    sid = data['sid']

    hostel_fee = int(data['hostel_fee'])

    mess_fee = int(data['mess_fee'])

    if sid in students:

        students[sid]['Hostel Fee'] = hostel_fee

        students[sid]['Mess Fee'] = mess_fee

        return jsonify({
            "message": "Fees Added Successfully!"
        })

    return jsonify({
        "message": "Student Not Found!"
    })
# --------------------------------
# Display Records
# --------------------------------

@app.route('/records')
def records():

    return jsonify(students)

# --------------------------------
# Search Student
# --------------------------------

@app.route('/search/<sid>')
def search_student(sid):

    if sid in students:

        return jsonify(students[sid])

    return jsonify({
        "message": "Student Not Found!"
    })


   # --------------------------------
# Bubble Sort Students by Marks
# --------------------------------
@app.route('/sort')
def sort_students():

    student_list = []

    for sid, data in students.items():

        temp = data.copy()

        temp['ID'] = sid

        student_list.append(temp)

    n = len(student_list)

    # Bubble Sort
    for i in range(n):

        for j in range(0, n - i - 1):

            if student_list[j]['Marks'] < student_list[j + 1]['Marks']:

                temp = student_list[j]

                student_list[j] = student_list[j + 1]

                student_list[j + 1] = temp

    return jsonify(student_list)
# --------------------------------
# Save Records
# --------------------------------

@app.route('/save')
def save_records():

    file = open("student_records.txt", "w")

    for sid, data in students.items():

        file.write(f"{sid} : {data}\n")

    file.close()

    return jsonify({
        "message": "Records Saved Successfully!"
    })

# --------------------------------
# Performance Analysis
# --------------------------------

@app.route('/analysis')
def analysis():

    marks = [

        data["Marks"]
        for data in students.values()

    ]

    names = [

        data["Name"]
        for data in students.values()

    ]

    if len(marks) == 0:

        return jsonify({
            "message": "No Data Available!"
        })

    arr = np.array(marks)

    average = np.mean(arr)
    highest = np.max(arr)
    lowest = np.min(arr)

    # Line Graph

    plt.figure(figsize=(6,4))

    plt.plot(
        names,
        marks,
        marker='o'
    )

    plt.title("Student Performance")

    plt.xlabel("Students")
    plt.ylabel("Marks")

    plt.grid(True)

    plt.savefig("static/performance.png")

    plt.close()

    # Pie Chart

    grade_count = {

        'A':0,
        'B':0,
        'C':0,
        'Fail':0
    }

    for data in students.values():

        grade_count[data['Grade']] += 1

    plt.figure(figsize=(5,5))

    plt.pie(

        grade_count.values(),

        labels=grade_count.keys(),

        autopct='%1.1f%%'

    )

    plt.title("Grade Distribution")

    plt.savefig("static/piechart.png")

    plt.close()

    return jsonify({

        "Average": float(average),

        "Highest": int(highest),

        "Lowest": int(lowest),

        "Graph": "/static/performance.png",

        "Pie": "/static/piechart.png"

    })

# --------------------------------
# Run Flask App
# --------------------------------

if __name__ == '__main__':

    app.run(debug=True)