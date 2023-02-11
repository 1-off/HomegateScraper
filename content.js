// function getRandomColor() {
//   var letters = "0123456789ABCDEF";
//   var color = "#";
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

// document.body.style.border = "5px solid " + getRandomColor();

function collector(saveType) {
  const resultList = document.getElementsByClassName(
    "ResultList_ListItem_3AwDq"
  );
  let resultArray = [];
  for (let i = 0; i < resultList.length; i++) {
    try {
      let currentResult = resultList[i];
      let price = currentResult.getElementsByClassName(
        "ListItemPrice_price_1o0i3"
      )[0].textContent;
      let area = currentResult.getElementsByClassName(
        "ListItemLivingSpace_value_2zFir"
      )[0].textContent;
      let link = currentResult.getElementsByClassName(
        "ListItem_itemLink_30Did"
      )[0].href;
      let address = currentResult.getElementsByTagName("p")[1].textContent;
      resultArray.push({ price, area, link, address });
    } catch (error) {
      console.error(error);
      continue;
    }
  }

  htmlToCsv(saveType, resultArray);
}

// function htmlToMarkdown(resultArray,saveType){
//   let lines = "| Price | Area | Link | Address | Zip | Town |\n| --- | --- | --- | --- | --- | --- |\n";
//   resultArray.forEach(result => {
//     let zipAndTown = result.address.match(/\b\d{4}\b\s*(\w+)/);
//     let zip = zipAndTown ? zipAndTown[0].split(" ")[0] : "";
//     let town = zipAndTown ? zipAndTown[0].split(" ").slice(1).join(" ") : "";
//     lines += `| ${result.price} | ${result.area} | [Link](${result.link}) | ${result.address} | ${zip} | ${town} |\n`;
//   });
// console.log(lines);

//   var filename = "data.md";
//   var type = "text/plain";

//   if (saveType === "copy-to-clipboard") {
//     saveToClipboard(lines);
//   }else{
//     saveToFile(filename, type, data)
//   }
// }

function htmlToCsv(saveType, resultArray) {
  let lines = "Price,Area,Link,Address,Zip,Town\n";
  resultArray.forEach((result) => {
    let zipAndTown = result.address.match(/\b\d{4}\b\s*(\w+)/);
    let zip = zipAndTown ? zipAndTown[0].split(" ")[0] : "";
    let town = zipAndTown ? zipAndTown[0].split(" ").slice(1).join(" ") : "";
    lines += `${result.price.replace(/,/g, '.').replace(".–", "")},${result.area.replace(/,/g, '.')},${result.link.replace(/,/g, '.')},${result.address.replace(/,/g, '.')},${zip.replace(/,/g, '.')},${town.replace(/,/g, '.')}\n`;
  });
  console.log(lines);

  var filename = "data.csv";
  var type = "text/csv";
  if (saveType === "copy-to-clipboard") {
    saveToClipboard(lines, resultArray.length);
  } else {
    saveToFile(filename, type, lines);
  }
}

// --------------------------- support functions --------------------------- //

function saveToFile(filename, type, data) {
  var blob = new Blob([data], { type: type });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  a.remove();
}

function saveToClipboard(value, listings) {
  // check if the browser supports the Clipboard API
  if (!navigator.clipboard) {
    alert("Clipboard API is not supported in your browser.");
    return;
  }

  // check if the value is too big
  if (value.length > 100000) {
    alert(
      `The returned value is too large ${value.length} to be saved to the clipboard. Please consider reducing its size.`
    );
    return;
  }

  if (listings <= 0){
    alert(`We are sorry, but ${listings} results have been found.\nTry these steps:\n1)refresh the page,\n2)sort the listing by the newest,\n3)scroll down the page till the last listing\n4)Try again`);

  }

  // write the value to the clipboard
  navigator.clipboard.writeText(value).then(
    function () {
      alert(`${listings} results have been saved to the clipboard successfully.`);
    },
    function (error) {
      alert(
        "An error occurred while saving the value to the clipboard.\n\n" + error
      );
    }
  );
}

browser.runtime.onMessage.addListener((message) => {
  console.log("content script Listener reachived:",message.type);
  collector (message.type);
});
