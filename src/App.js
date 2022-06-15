import "./App.css";
import {useState} from "react";
import {v4 as myNewId} from "uuid";
// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];



function App() {
  const [itemTodo, setItemTodo] = useState("");

  const checkStorageItems = JSON.parse(localStorage.getItem("item"))

  const [items, setItems] = useState(checkStorageItems?checkStorageItems:[
    {
      key: myNewId(),
      label: "Have fun",
    },
    {
      key: myNewId(),
      label: "Spread Empathy",
    },
    {
      key: myNewId(),
      label: "Generate Value",
    },
  ]);
  const [filterType, setFilterType] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const handleToDoChange = (event) =>{
    setItemTodo(event.target.value);
  };
  const handleSearch = (event) =>{
    const writedText = event.target.value.toLowerCase();
    // console.log(writedText);
    setSearchFilter(writedText);
  };

  // window.onload = function() {
  //   const initialItems = []

  //   for (let i = 0; i < localStorage.length; i++) {
  //       initialItems.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
  //   }

  //   setItems((prevElement) => [initialItems, ...prevElement]);
  // };
  const handleAddItem = () =>{
    if(itemTodo !== ""){
      const newItem = {key:myNewId(), label:itemTodo};
      setItems((prevElement) => [newItem, ...prevElement]);


      const storageNewItem = JSON.stringify([newItem, ...items]);
      localStorage.setItem('item', storageNewItem);
      setItemTodo("");
    }
    
  };
  const handleItemDone = ({key}) =>{
    //first way
    // const itemIndex = items.findIndex((item) => item.key === key);
    // const oldItem = items[itemIndex];
    // const newItem = { ...oldItem, done: !oldItem.done };
    // const leftSideOfAnArray = items.slice(0, itemIndex);
    // const rightSideOfAnArray = items.slice(itemIndex + 1, items.length);
    // setItems([...leftSideOfAnArray, newItem, ...rightSideOfAnArray]);

    // setItems((prevItems)=>
    //   prevItems.map((item)=>{
    //     if (item.key === key){
    //       return {...item, done: !item.done};
    //     } else return item;
    //   })
    // );
    
    const doneItem = items.map((item)=>{
      if (item.key === key){
        return {...item, done: !item.done};
      } else return item;
    })
    
    setItems(doneItem)
    
    const storageNewItem = JSON.stringify(doneItem);
    localStorage.setItem('item', storageNewItem);
    // console.log(key);
    //()=> для передачи параметров callback
  };

  const handleItemDelete = ({key}) => {
    const itemIndex = items.findIndex((item) => item.key === key);
    const leftSide = items.slice(0, itemIndex);
    const rightSide = items.slice(itemIndex + 1, items.length);
    setItems([...leftSide, ...rightSide]);
  };

  const handleItemImportant = ({key}) => {
    // setItems((prevItems) =>
    // prevItems.map((item) =>{
    //   if (item.key === key){
    //     return {...item, important: !item.important};
    //   } else return item;
    // })
    // );
    const importantItem = items.map((item)=>{
      if (item.key === key){
        return {...item, important: !item.important};
      } else return item;
    })
    
    setItems(importantItem)
    
    const storageNewItem = JSON.stringify(importantItem);
    localStorage.setItem('item', storageNewItem);
  };

  const handleFilterItems = (type) => {
    setFilterType(type);
  };

  const amountDone = items.filter((item) => item.done).length;

  const amountLeft = items.length - amountDone;
  // console.log(setSearchFilter);
  //item.label.includes(setSearchFilter) и по нему filteredItems
  const filteredItems =
    !filterType || filterType === "all"
      ? items
      : filterType === "active"
      ? items.filter((item) => !item.done)
      : items.filter((item) => item.done);
  

  console.log(filteredItems)
      
  const searchedItems = filteredItems.filter((item) => item.label.toLowerCase().includes(searchFilter));//how to lowercase, enteradd and emptytodoadd?
  const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleAddItem();
      }
  };
  
  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>{amountLeft} more to do, {amountDone} done</h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          onChange={handleSearch}
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {/* Button group */}
          {buttons.map((item)=>(
            <button 
            onClick={() => handleFilterItems(item.type)}
            key={item.type}
            type="button"
            className={`btn btn-${
              filterType !== item.type ? "outline-" : ""
            }info`}>
            {item.label}
          </button>
          ))}
          
        </div>
      </div>

      {/* List-group This! when filtereditems*/}
      <ul className="list-group todo-list">
        {searchedItems.length> 0 && searchedItems.map((item)=>(
          <li key={item.key} className="list-group-item">
          <span className={`todo-list-item${item.done ? " done" : ""}${item.important ? " important" :""}`}>
            <span className="todo-list-item-label" onClick={() => handleItemDone(item)}>{item.label}</span>

            <button
              type="button"
              className="btn btn-outline-success btn-sm float-right"
              onClick={() => handleItemImportant(item)}
            >
              <i className="fa fa-exclamation" />
            </button>

            <button
              type="button"
              className="btn btn-outline-danger btn-sm float-right"
              onClick={() => handleItemDelete(item)}
            >
              <i className="fa fa-trash-o" />
            </button>
          </span>
        </li>
        ))}
      </ul>

      <div className="item-add-form d-flex">
        <input
          value={itemTodo}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleToDoChange}
          onKeyDown={handleKeyDown} 
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>Add item</button>
      </div>
    </div>
  );
}

export default App;
