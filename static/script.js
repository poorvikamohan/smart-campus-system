
// Register Student

async function registerStudent(){

    let sid =
        document.getElementById("sid").value;

    let name =
        document.getElementById("name").value;

    let marks =
        document.getElementById("marks").value;

    let response =
        await fetch('/register', {

        method:'POST',

        headers:{
            'Content-Type':'application/json'
        },

        body:JSON.stringify({
            sid,
            name,
            marks
        })

    });

    let data =
        await response.json();

    alert(data.message);

    document.getElementById("sid").value="";
    document.getElementById("name").value="";
    document.getElementById("marks").value="";

    displayRecords();
}

// Course Registration

async function enrollCourse(){

    let sid =
        document.getElementById("courseSid").value;

    let course =
        document.getElementById("course").value;

    let response =
        await fetch('/course', {

        method:'POST',

        headers:{
            'Content-Type':'application/json'
        },

        body:JSON.stringify({
            sid,
            course
        })

    });

    let data =
        await response.json();

    alert(data.message);

    document.getElementById("courseSid").value="";
    document.getElementById("course").value="";

    displayRecords();
}

// Hostel + Mess Fee

// Hostel + Mess Fee

async function saveFee(){

    let sid =
        document.getElementById("feeSid").value;

    let hostel_fee =
        document.getElementById("hostel").value;

    let mess_fee =
        document.getElementById("mess").value;

    let response =
        await fetch('/hostel_fee', {

        method:'POST',

        headers:{
            'Content-Type':'application/json'
        },

        body:JSON.stringify({

            sid:sid,

            hostel_fee:hostel_fee,

            mess_fee:mess_fee

        })

    });

    let data =
        await response.json();

    alert(data.message);

    // CLEAR INPUTS

    document.getElementById("feeSid").value="";

    document.getElementById("hostel").value="";

    document.getElementById("mess").value="";

    // REFRESH TABLE

    displayRecords();
}

// Display Records

async function displayRecords(){

    let response =
        await fetch('/records');

    let data =
        await response.json();

    let table =
        document.getElementById("studentTable");

    table.innerHTML="";

    for(let sid in data){

        let student = data[sid];

        let gradeClass = "";

        if(student.Grade === 'A'){
            gradeClass = "gradeA";
        }

        else if(student.Grade === 'B'){
            gradeClass = "gradeB";
        }

        else if(student.Grade === 'C'){
            gradeClass = "gradeC";
        }

        else{
            gradeClass = "gradeFail";
        }

        table.innerHTML += `

        <tr>

            <td>${sid}</td>

            <td>${student.Name}</td>

            <td>${student.Marks}</td>

            <td class="${gradeClass}">
                ${student.Grade}
            </td>

            <td>${student.Course}</td>

            <td>${student["Hostel Fee"]}</td>

            <td>${student["Mess Fee"]}</td>

        </tr>

        `;
    }
}

// Search Student

async function searchStudent(){

    let sid =
        document.getElementById("searchSid").value;

    let response =
        await fetch(`/search/${sid}`);

    let data =
        await response.json();

    let result =
        document.getElementById("searchResult");

    if(data.message){

        result.innerHTML =
            `<p>${data.message}</p>`;

    }

    else{

        result.innerHTML = `

        <p><b>Name:</b> ${data.Name}</p>

        <p><b>Marks:</b> ${data.Marks}</p>

        <p><b>Grade:</b> ${data.Grade}</p>

        <p><b>Course:</b> ${data.Course}</p>

        <p><b>Hostel Fee:</b>
            ${data["Hostel Fee"]}
        </p>

        <p><b>Mess Fee:</b>
            ${data["Mess Fee"]}
        </p>

        `;
    }

    document.getElementById("searchSid").value="";
}

// Sort Students

async function sortStudents(){

    let response =
        await fetch('/sort');

    let data =
        await response.json();

    let table =
        document.getElementById("studentTable");

    table.innerHTML="";

    data.forEach(student => {

        table.innerHTML += `

        <tr>

            <td>${student.ID}</td>

            <td>${student.Name}</td>

            <td>${student.Marks}</td>

            <td>${student.Grade}</td>

            <td>${student.Course}</td>

            <td>${student["Hostel Fee"]}</td>

            <td>${student["Mess Fee"]}</td>

        </tr>

        `;
    });
}

// Save Records

async function saveRecords(){

    let response =
        await fetch('/save');

    let data =
        await response.json();

    alert(data.message);
}

// Performance Analysis

async function performanceAnalysis(){

    let response =
        await fetch('/analysis');

    let data =
        await response.json();

    let result =
        document.getElementById("analysisResult");

    if(data.message){

        result.innerHTML =
            data.message;

    }

    else{

        result.innerHTML = `

        <h3>
            Average Marks :
            ${data.Average}
        </h3>

        <h3>
            Highest Marks :
            ${data.Highest}
        </h3>

        <h3>
            Lowest Marks :
            ${data.Lowest}
        </h3>

        `;

        document.getElementById("graph")
            .src =
            data.Graph + "?" + new Date().getTime();

        document.getElementById("piechart")
            .src =
            data.Pie + "?" + new Date().getTime();
    }
}