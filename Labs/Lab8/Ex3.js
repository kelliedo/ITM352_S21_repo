require("./products_data.js"); 

for(var item_num = 1; eval("typeof name"+item_num) != 'undefined'; item_num++) {
    console.log(`${item_num}. ${eval('name')}`)
}

console.log("That's all we have!");