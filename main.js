const toDoList = document.querySelector(".todo-list");

//adding new items to the list
let itemBackupCopy;
addNewItem();
function addNewItem() {
  const newToDoInput = document.querySelector(".new-todo");

  newToDoInput.onchange = () => {
    if (!!newToDoInput.value.trim()) {
      const newItemToAdd = !!itemBackupCopy
        ? itemBackupCopy.cloneNode(true)
        : toDoList.firstElementChild.cloneNode(true);

      newItemToAdd.className = "";
      newItemToAdd.querySelector("label").innerText = newToDoInput.value;
      newItemToAdd.querySelector("input").checked = false;

      toDoList.append(newItemToAdd);
      newToDoInput.value = "";

      filterItemsByState();
    } else return false;
  };
}

//removing items on destroy button click
deleteSingleItem();
function deleteSingleItem() {
  let buttonDestroyCollection = document.getElementsByClassName("destroy");
  let toDoItems = getItemsAll();

  [...buttonDestroyCollection].forEach((button, index) => {
    button.onclick = () => {
      toDoItems[index].remove();
      itemBackupCopy = toDoItems[index].cloneNode(true);
    };
  });
}

//reacting to checkbox check/uncheck
toggleItemStatus();
function toggleItemStatus() {
  let checkBoxCollection = document.getElementsByClassName("toggle");
  let toDoItems = getItemsAll();

  [...checkBoxCollection].forEach((checkbox, index) => {
    checkbox.onchange = () => {
      toDoItems[index].classList.toggle("completed");
      filterItemsByState();
    };
  });
}

//selecting/deselecting *all* items
toggleAllItemsStatus();
function toggleAllItemsStatus() {
  const buttonToggleAll = document.querySelector(".toggle-all");
  buttonToggleAll.onchange = () => {
    const toDoItems = toDoList.getElementsByTagName("li");
    const checkBoxCollection = document.getElementsByClassName("toggle");

    if (buttonToggleAll.checked) {
      [...checkBoxCollection].forEach((item, index) => {
        item.checked = true;
        toDoItems[index].className = "completed";
      });
    } else {
      [...checkBoxCollection].forEach((item, index) => {
        item.checked = false;
        toDoItems[index].className = "";
      });
    }
  };
}

//checking if all items are completed
checkIfAllToggled();
function checkIfAllToggled() {
  const buttonToggleAll = document.querySelector(".toggle-all");

  const allCompleted = getItemsDone().length === getItemsAll().length;

  if (allCompleted) {
    buttonToggleAll.checked = true;
  } else {
    buttonToggleAll.checked = false;
  }
}

//editing list items on double-click
editItem();
function editItem() {
  let labelItems = toDoList.getElementsByTagName("label");
  [...labelItems].forEach(labelItem => {
    labelItem.ondblclick = () => {
      labelItem.contentEditable = true;
      setTimeout(() => {
        labelItem.focus();
      });

      labelItem.onfocus = () => {
        document
          .getSelection()
          .setBaseAndExtent(
            labelItem,
            labelItem.childNodes.length,
            labelItem,
            labelItem.childNodes.length
          );
      };
    };

    labelItem.onblur = () => {
      labelItem.contentEditable = false;
    };

    labelItem.onkeydown = event => {
      if (event.key === "Enter") {
        if (!labelItem.innerHTML) {
          labelItem.closest("li").remove();
        } else {
          labelItem.blur();
        }
      }
    };
  });
}

//filters
filterItemsByState();
function filterItemsByState() {
  const filterSection = document.querySelector(".filters");
  const filterLinks = filterSection.getElementsByTagName("a");
  const activeFilter = filterSection.querySelector(".selected");

  switch (activeFilter.getAttribute("href")) {
    case "/active":
      for (let item of getItemsDone()) {
        item.hidden = true;
      }
      for (let item of getItemsUndone()) {
        item.hidden = false;
      }
      break;
    case "/completed":
      for (let item of getItemsDone()) {
        item.hidden = false;
      }
      for (let item of getItemsUndone()) {
        item.hidden = true;
      }
      break;
    case "/":
      for (let item of getItemsAll()) {
        item.hidden = false;
      }
      break;
    default:
      break;
  }
}

reactToFilterSelect();
function reactToFilterSelect() {
  const filterSection = document.querySelector(".filters");
  const filterLinks = filterSection.getElementsByTagName("a");

  [...filterLinks].forEach(link => {
    link.onclick = ev => {
      ev.preventDefault();

      for (let filterLink of filterLinks) {
        filterLink.className = "";
      }
      link.className = "selected";

      filterItemsByState(link);
    };
  });
}

//clear completed button
clearCompletedItems();
function clearCompletedItems() {
  const clearCompletedButton = document.querySelector(".clear-completed");
  clearCompletedButton.onclick = () => {
    let completedItems = getItemsDone();
    itemBackupCopy = getItemsAll()[0].cloneNode(true);
    completedItems.forEach(item => {
      item.remove();
    });
  };
}

//show clear completed button
showClearCompletedButton();
function showClearCompletedButton() {
  let clearCompletedButton = document.querySelector(".clear-completed");
  if (getItemsDone().length) {
    clearCompletedButton.hidden = false;
  } else {
    clearCompletedButton.hidden = true;
  }
}

//showing footer
showFooter();
function showFooter() {
  let footer = document.querySelector(".footer");
  if (getItemsAll().length) {
    footer.hidden = false;
  } else {
    footer.hidden = true;
  }
}

//function for calculating items left to do
function updateToDoCount() {
  const toDoCount = document.querySelector(".todo-count");
  const toDoItemsNumber = getItemsUndone().length;

  if (toDoItemsNumber === 0) {
    toDoCount.innerHTML = `<strong>${toDoItemsNumber}</strong> items left`;
  } else if (toDoItemsNumber === 1) {
    toDoCount.innerHTML = `<strong>${toDoItemsNumber}</strong> item left`;
  } else {
    toDoCount.innerHTML = `<strong>${toDoItemsNumber}</strong> items left`;
  }
}

//function for getting all items:
function getItemsAll() {
  return [...toDoList.getElementsByTagName("li")];
}

//function for getting uncompleted items
function getItemsUndone() {
  return [...toDoList.getElementsByTagName("li")].filter(
    item => item.className !== "completed"
  );
}

//function for getting completed items
function getItemsDone() {
  return [...toDoList.getElementsByTagName("li")].filter(
    item => item.className === "completed"
  );
}

//adding mutation observer to the list to track its changes and rerun functions
let toDoListObserver = new MutationObserver(() => {
  toggleItemStatus();
  deleteSingleItem();
  editItem();
  updateToDoCount();
  showClearCompletedButton();
  showFooter();
  checkIfAllToggled();
});
toDoListObserver.observe(toDoList, {
  childList: true,
  subtree: true,
  attributes: true
});
