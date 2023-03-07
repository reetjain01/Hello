const processTable = document.getElementById("processTable");
const processIDInput = document.getElementById("processIDInput");
const arrivalTimeInput = document.getElementById("arrivalTimeInput");
const cpuBurstTimeInput = document.getElementById("cpuBurstTimeInput");
const priorityInput = document.getElementById("priorityInput");
const addButton = document.getElementById("addButton");
const dropButton = document.getElementById("dropButton");
const calculateButton = document.getElementById("calculateButton");
const resultTable = document.getElementById("resultTable");

let processes = [];

addButton.addEventListener("click", function() {
  const processID = processIDInput.value;
  const arrivalTime = arrivalTimeInput.value;
  const cpuBurstTime = cpuBurstTimeInput.value;
  const priority = priorityInput.value;

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

dropButton.addEventListener("click", function() {
  const processID = processIDInput.value;

  if (processID === "") {
    alert("Enter a Process ID to drop!");
    return;
  }

  const indexToRemove = processes.findIndex(process => process.processID === processID);

  if (indexToRemove === -1) {
    alert("Process not found!");
    return;
  }

  processes.splice(indexToRemove, 1);

  let indexToDelete = -1;
  for (let i = 1; i < processTable.rows.length; i++) {
    if (processTable.rows[i].cells[0].innerHTML === processID) {
      indexToDelete = i;
      break;
    }
  }

  if (indexToDelete !== -1) {
    processTable.deleteRow(indexToDelete);
  }

  processIDInput.value = "";

});


// logic
calculateButton.addEventListener("click", function() {
if (processes.length === 0) {
alert("Add some processes first!");
return;
}

resultTable.style.display = "";

const result = calculatePreemptivePriorityCPU(processes);

result.forEach(process => {
const row = resultTable.insertRow();
const processIDCell = row.insertCell(0);
const arrivalTimeCell = row.insertCell(1);
const cpuBurstTimeCell = row.insertCell(2);
const priorityCell = row.insertCell(3);
const completionTimeCell = row.insertCell(4);
const turnaroundTimeCell = row.insertCell(5);
const waitingTimeCell = row.insertCell(6);
const responseTimeCell = row.insertCell(7);
// const startTimeCell = row.insertCell(8)


processIDCell.innerHTML = process.processID;
arrivalTimeCell.innerHTML = process.arrivalTime;
cpuBurstTimeCell.innerHTML = process.cpuBurstTime;
priorityCell.innerHTML = process.priority;
completionTimeCell.innerHTML = process.completionTime;
turnaroundTimeCell.innerHTML = process.turnaroundTime;
waitingTimeCell.innerHTML = process.waitingTime;
responseTimeCell.innerHTML = process.responseTime;
// startTimeCell.innerHTML = process.startTime;
});
});



function calculatePreemptivePriorityCPU(processes) {

  const n = processes.length; 
  burst_remaining = new Array(n).fill(0);
  let current_time=0;
  let completed = 0;
  let is_completed= new Array(100).fill(0);


  for(let i=0;i<n;i++)
  {
    burst_remaining[i] = processes[i].cpuBurstTime;
  }


  while(completed != n)
  {
    let index = -1;
    let max = Number.MAX_SAFE_INTEGER;

    for(let i=0;i<n;i++)
    {
        if(processes[i].arrivalTime <= current_time && is_completed[i]==0)
        {
            if(processes[i].priority < max)
            {
                max = processes[i].priority;
                index = i;
            }
            if(processes[i].priority == max) {
                if(processes[i].arrivalTime < processes[index].arrivalTime) {
                    max = processes[i].priority;
                    index = i;
                }
            }
        }
    }

    if(index != -1)
    {
        
        if(burst_remaining[index] == processes[index].cpuBurstTime){
          processes[index].startTime = current_time;
          
        }
        burst_remaining[index] -= 1;
        current_time++;
        
        if(burst_remaining[index] == 0)
        {
           
            processes[index].completionTime = current_time;
            processes[index].turnaroundTime = processes[index].completionTime - processes[index].arrivalTime;
            processes[index].waitingTime = processes[index].turnaroundTime - processes[index].cpuBurstTime;
            processes[index].responseTime = processes[index].startTime - processes[index].arrivalTime;

            is_completed[index] = 1;
            completed++;
        }
    }
    else{
        current_time++;
    }

  }
  return processes;
}