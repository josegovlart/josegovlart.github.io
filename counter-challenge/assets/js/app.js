let count = 0;
const counter = () => {
    count++;
    document.getElementById("counter").innerHTML = count;
    count == 99 ? count = 0 : '';
    // if (count == 99) { //if que poderia
    //     count = 0;     //ser utilizado
    // }
}
setInterval(counter, 1000);