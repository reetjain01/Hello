// it will display the input form and the table both at the same time

function toggleHide(){
  let addbtn = document.getElementById("add-btn");
  let form = document.getElementById('form');
  if(form.style.display!='none'){
  form.style.display = 'none';
  }
  else{
     form.style.display = 'block'; 
  }
} 




const processTable = document.getElementById("processTable");
const processIDInput = document.getElementById("processIDInput");
const arrivalTimeInput = document.getElementById("arrivalTimeInput");
const cpuBurstTimeInput = document.getElementById("cpuBurstTimeInput");
const priorityInput = document.getElementById("priorityInput");
const add = document.getElementById("add");
// const dropButton = document.getElementById("dropButton");
const resetButton = document.getElementById("reset");
const calculateButton = document.getElementById("calculateButton");
const resultTable = document.getElementById("resultTable");
const GanttChartTable = document.getElementById("GanttChart");
const AvgWaitTime = document.getElementById("AvgWaitTime");
const AvgTATime = document.getElementById("AvgTATime");

let processes = [];
  const M = 1000, N = 2;
  let GanttChart = new Array(M);            // create an empty array of length `M`
  for (var i = 0; i < M; i++) {
    GanttChart[i] = new Array(N).fill(0);        // make each element an array
  }
  add.addEventListener("click", function () {
    const processID = processIDInput.value;
    const arrivalTime = arrivalTimeInput.value;
    const cpuBurstTime = cpuBurstTimeInput.value;
    const priority = priorityInput.value;
    if (cpuBurstTime<=0) {
      alert("Please enter cpu burst time greater than zero");
      return;
    }
    if (arrivalTime<0) {
      alert("Please enter arrival time greater or equal to zero");
      return;
    }
    if (priority<0) {
      alert("Please enter prirority greater or equal to zero");
      return;
    }

    if (processID === "" || arrivalTime === "" || cpuBurstTime === "" || priority === "") {
      alert("All fields are required!");
      return;
    }

    processes.push({
      processID,
      arrivalTime: parseInt(arrivalTime),
      cpuBurstTime: parseInt(cpuBurstTime),
      priority: parseInt(priority)
    });

    const row = processTable.insertRow();
    const processIDCell = row.insertCell(0);
    const arrivalTimeCell = row.insertCell(1);
    const cpuBurstTimeCell = row.insertCell(2);
    const priorityCell = row.insertCell(3);

    processIDCell.innerHTML = processID;
    arrivalTimeCell.innerHTML = arrivalTime;
    cpuBurstTimeCell.innerHTML = cpuBurstTime;
    priorityCell.innerHTML = priority;

    processIDInput.value = "";
    arrivalTimeInput.value = "";
    cpuBurstTimeInput.value = "";
    priorityInput.value = "";
  });

  // dropButton.addEventListener("click", function () {
  //   const processID = processIDInput.value;

  //   if (processID === "") {
  //     alert("Enter a Process ID to drop!");
  //     return;
  //   }

  //   const indexToRemove = processes.findIndex(process => process.processID == processID);

  //   if (indexToRemove == -1) {
  //     alert("Process not found!");
  //     return;
  //   }

  //   processes.splice(indexToRemove, 1);

  //   let indexToDelete = -1;
  //   for (let i = 1; i < processTable.rows.length; i++) {
  //     if (processTable.rows[i].cells[0].innerHTML == processID) {
  //       indexToDelete = i;
  //       break;
  //     }
  //   }

  //   if (indexToDelete !== -1) {
  //     processTable.deleteRow(indexToDelete);
  //   }

  //   processIDInput.value = "";

  // });

  resetButton.addEventListener("click", function () {

    var getValue = document.getElementById("processIDInput");
    if (getValue.value != "") {
      getValue.value = "";
    }
    var getValue1 = document.getElementById("arrivalTimeInput");
    if (getValue1.value != "") {
      getValue1.value = "";
    }
    var getValue2 = document.getElementById("cpuBurstTimeInput");
    if (getValue2.value != "") {
      getValue2.value = "";
    }
    var getValue3 = document.getElementById("priorityInput");
    if (getValue3.value != "") {
      getValue3.value = "";
    }

  });

  calculateButton.addEventListener("click", function () {
    if (processes.length === 0) {
      alert("Add some processes first!");
      return;
    }

    // resultTable.style.display = "";

    document.getElementById("GanttChart1").style.visibility = "visible";
    add.style.display="none";
    // dropButton.style.display="none";
    resetButton.style.display="none";
    calculateButton.style.display="none";
    resultTable.style.visibility = "visible";
    AvgTATime.style.visibility = "visible";
    AvgWaitTime.style.visibility = "visible";

    const result = priorityScheduling(processes);

    result.forEach(process => {
      const row = resultTable.insertRow();
      const processIDCell = row.insertCell(0);
      const arrivalTimeCell = row.insertCell(1);
      const cpuBurstTimeCell = row.insertCell(2);
      const priorityCell = row.insertCell(3);
      const completionTimeCell = row.insertCell(4);
      const turnaroundTimeCell = row.insertCell(5);
      const waitingTimeCell = row.insertCell(6);
      const startTimeCell = row.insertCell(7);
      const responseTimeCell = row.insertCell(8);


      processIDCell.innerHTML = process.processID;
      arrivalTimeCell.innerHTML = process.arrivalTime;
      cpuBurstTimeCell.innerHTML = process.cpuBurstTime;
      priorityCell.innerHTML = process.priority;
      completionTimeCell.innerHTML = process.completionTime;
      turnaroundTimeCell.innerHTML = process.turnaroundTime;
      waitingTimeCell.innerHTML = process.waitingTime;
      startTimeCell.innerHTML = process.startTime;
      responseTimeCell.innerHTML = process.responseTime;
    });
  });


  // logic
  function priorityScheduling(processes) {

    const n = processes.length;
    burst_remaining = new Array(n).fill(0);
    let current_time = 0;
    let completed = 0;
    let is_completed = new Array(100).fill(0);
    let prev = -1;
    let b = 0;
    let a = 0;

    for (let i = 0; i < n; i++) {
      burst_remaining[i] = processes[i].cpuBurstTime;
    }


    while (completed != n) {
      let index = -1;
      let max = Number.MAX_SAFE_INTEGER;

      for (let i = 0; i < n; i++) {
        if (processes[i].arrivalTime <= current_time && is_completed[i] == 0) {
          if (processes[i].priority < max) {
            max = processes[i].priority;
            index = i;
          }
          if (processes[i].priority == max) {
            if (processes[i].arrivalTime < processes[index].arrivalTime) {
              max = processes[i].priority;
              index = i;
            }
          }
        }
      }

      if (index != -1) {

        if (burst_remaining[index] == processes[index].cpuBurstTime) {
          processes[index].startTime = current_time;
          if (prev == -1) {
            GanttChart[b][0] = processes[index].startTime;
            GanttChart[b][1] = processes[index].processID;
            b++;
            GanttChart[b][0] = processes[index].startTime;
          }
        }
        if (prev != index && prev != -1) {
          let a = b;
          GanttChart[b][1] = processes[index].processID;
          b++;
          GanttChart[b][0] = GanttChart[a][0];

        }

        GanttChart[b][0] = GanttChart[b][0] + 1;


        burst_remaining[index] -= 1;

        current_time++;


        if (burst_remaining[index] == 0) {

          processes[index].completionTime = current_time;
          processes[index].turnaroundTime = processes[index].completionTime - processes[index].arrivalTime;
          processes[index].waitingTime = processes[index].turnaroundTime - processes[index].cpuBurstTime;
          processes[index].responseTime = processes[index].startTime - processes[index].arrivalTime;

          is_completed[index] = 1;
          completed++;
        }
        prev = index;
      }
      else {
        current_time++;
      }

    }
    let avgWaitingTime = 0;
    let avgTurnAroundTime = 0;
    for (let i = 0; i < n; i++) {
      avgWaitingTime += processes[i].waitingTime;
      avgTurnAroundTime += processes[i].turnaroundTime;
    }

    avgWaitingTime = avgWaitingTime / n;

    avgTurnAroundTime = avgTurnAroundTime / n;

    // incorrect code
    // let xhr = new XMLHttpRequest();
    // xhr.open("POST", "index.php", true);
    // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // xhr.send("avgWaitingTime" + avgWaitingTime + "&avgTurnAroundTime" + avgTurnAroundTime);

    let row1 = GanttChartTable.insertRow();
    let row2 = GanttChartTable.insertRow();
    let row3 = GanttChartTable.insertRow();
    row1.insertCell(0).innerHTML = "Start Time";
    row2.insertCell(0).innerHTML = "Running Procces";
    row3.insertCell(0).innerHTML = "End Time";
    for (let i = 0; i < 100; i++) {
      let a = i;
      a++;
      if (GanttChart[i][1] == 0) {
        break;
      }
      else {
        row1.insertCell(a).innerHTML = GanttChart[i][0];
        row2.insertCell(a).innerHTML = GanttChart[i][1];
        row3.insertCell(a).innerHTML = GanttChart[a][0];
      }

    }

    document.getElementById("avgWaitTime").innerHTML = avgWaitingTime;
    document.getElementById("avgTATime").innerHTML = avgTurnAroundTime;

    $.ajax({
      type: "POST",
      url: "index.php",
      data: { avgWaitingTime: avgWaitingTime, avgTurnAroundTime: avgTurnAroundTime },
    });
    return processes;
  }