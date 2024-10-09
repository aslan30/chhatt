let arr = [10, 20, 30];
console.log(arr);
console.log(...arr); //spread




// console.log(arr[0], arr[1], arr[2]);

let [a, b, c] = arr;
console.log('result:', a, b, c);  //диструктиризация




function s(n1, n2, n3) {
    return n1 + n2 + n3
}
console.log(s(...arr));

const new_arr = ['my', 'program', 'is', 'good'];
let [s1, s2, ...other] = new_arr  //rest
console.log(s1, s2);
console.log(other);



const names = ['Aslan', 'Bogdan'];
let [n1, n2, n3 = 'Nurilo', n4 = 'Kamron'] = names;
console.log(n1, n2, n3, n4);

let square = {
    name: 'kvadrat',
    side: 5, 
    background: "green"
}

let{name: n, side: sd, background = "red"} = square //диструктиризация с объектами
console.log(n, sd, background);

let [side, ...another] = square
console.log(side, another);


//////////////////////////////////////////////////////////////////////////////////////////


// let numb = [10, 20, 30, 40];
// let numb2 = [...numb, 100];
// console.log(numb2)

// function sumNumbers(...other) {
//     let sum = 0
//     for (let i = 0; i < other.length; i++){
//         sum += other[i]
//     }
//     return sum
// }

// console.log(sumNumbers(10, 20, 30));


// let person = {
//     name: 'kvadrat',
//     age: 5, 
//     country: "Uzb"
// }

// let{name: personName, age: personAge, country: personCountry} = person;

// let users = [
//     {
//         name: "Aslan",
//         age: 26
//     },

//     {
//         name: "Bogdan",
//         age: 25
//     }
// ]


// let userSummaries = users.map((e) => {let {name, age} = e 
// return `${name} - ${age}`})
// console.log(userSummaries)

// let arr1 = [1,2,34,5];
// let arr2 = [2,4,64,8];
// margedArray = [...arr1, ...arr2]
// console.log(margedArray)

// let coordinates = [180, 30];
// let [latitude, longitude] = coordinates
// console.log('coordinates', latitude,longitude)