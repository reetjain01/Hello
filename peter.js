function show(){
  let con = document.getElementById("continue");
  let form2 = document.getElementById('form2');
  if(form2.style.display!='none'){
  form2.style.display = 'none';
  }
  else{
     form2.style.display = 'block'; 
  }
} 

var o_id=[];
var o_p_time= [];
var o_c_time = [];
const form = document.getElementById("form2");
const cont = document.getElementById("continue");
const processTable = document.getElementById("processTable");
const process_output_Table = document.getElementById("process_output_Table");
const processNoInput = document.getElementById("processNoInput");
const bufferSizeInput = document.getElementById("bufferSizeInput");
const processIDInput = document.getElementById("processIDInput");
const produceTimeInput = document.getElementById("produceTimeInput");
const consumeTimeInput = document.getElementById("consumeTimeInput");
const addButton = document.getElementById("add");
const reset1 = document.getElementById('reset1');
const reset = document.getElementById('reset');

var processNo;
var bufferSize;
cont.addEventListener("click" , function () {
 processNo = processNoInput.value;
 bufferSize = bufferSizeInput.value;

if(processNo === "" || bufferSize === " "){
  alert("All Fields are Required!");
}
else if(processNo != "" || bufferSize != " ")
form.style.display = 'block';

})
var processid = [];
var consume_time = [];
var produce_time = [];

reset.addEventListener("click", function () {

  var getValue4 = document.getElementById("processNo");
  if (getValue4.value != "") {
    getValue4.value = "";
  }
  var getValue5 = document.getElementById("bufferSize");
  if (getValue5.value != "") {
    getValue5.value = "";
  }
});

reset1.addEventListener("click", function () {

  var getValue = document.getElementById("processIDInput");
  if (getValue.value != "") {
    getValue.value = "";
  }
  var getValue1 = document.getElementById("produceTimeInput");
  if (getValue1.value != "") {
    getValue1.value = "";
  }
  var getValue2 = document.getElementById("consumeTimeInput");
  if (getValue2.value != "") {
    getValue2.value = "";
  }
});

addButton.addEventListener("click", function () {


const processID = processIDInput.value;
 const produceTime = produceTimeInput.value;
 const consumeTime = consumeTimeInput.value;
 

 if (processID === ""  || produceTime === "" || consumeTime === "") {
   alert("All fields are required!");
   return;
 }

 const table = document.getElementById("table");
 table.style.visibility = 'visible';

 const output_table = document.getElementById("output_table");
 output_table.style.visibility = 'visible';

 

 const row = processTable.insertRow();
 const processIDCell = row.insertCell(0);
 const produceTimeCell = row.insertCell(1);
 const consumeTimeCell = row.insertCell(2);
  
 processIDCell.innerHTML = processID;
 produceTimeCell.innerHTML = produceTime;
 consumeTimeCell.innerHTML = consumeTime;
 processid.push(processID);
 produce_time.push(parseInt(produceTime));
 consume_time.push(parseInt(consumeTime));
 
console.log(processid.length);

 if(processid.length  == processNo){
  peterson(bufferSize,processid,produce_time,consume_time);
  for(let j = 0 ; j< processid.length;j++){
    const o_row = process_output_Table.insertRow();
    const o_p_id_cell = o_row.insertCell(0);
    const o_p_ptime_cell = o_row.insertCell(1);
    const o_c_time_cell = o_row.insertCell(2);

    o_p_id_cell.innerHTML = o_id[j];
    o_p_ptime_cell.innerHTML = o_p_time[j];
    o_c_time_cell.innerHTML = o_c_time[j];
  }
 }})

;
function peterson(n,process_id,p_time,c_time){

var time = 0;
var buffer_index= -1;
var no_of_processes_produced =0 ;
var no_of_processes_consumed= 0;
var no_of_processes = process_id.length;
var producer_time = 0;
var consumer_time = 0;

sum(p_time);
sum(c_time);

while(no_of_processes_consumed < no_of_processes) {
    time = time +1;
    if(no_of_processes_produced != no_of_processes&& buffer_index <= n - 2){
        producer_time = producer_time + 1;
        if(p_time[no_of_processes_produced] == producer_time){
            o_id[no_of_processes_produced] = process_id[no_of_processes_produced];
            o_p_time[no_of_processes_produced] = time;
            buffer_index = buffer_index +1;
            
            
            no_of_processes_produced++;
        }
    }
    if(no_of_processes_consumed != no_of_processes && buffer_index != -1){
        consumer_time= consumer_time +1;
        if(c_time[no_of_processes_consumed] + 1 + no_of_processes_consumed == consumer_time){
            o_c_time[no_of_processes_consumed] = time ;
            buffer_index = buffer_index - 1 ;
            no_of_processes_consumed = no_of_processes_consumed + 1;
            
            
        }}
}
}
function sum(arr){
    temp = arr[0];
    for (let i = 1 ; i < arr.length ;i++){
        arr[i] = temp + arr[i];
        temp = arr[i];
    }
}

