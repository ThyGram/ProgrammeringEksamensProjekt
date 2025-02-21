
let url = "https://www.themealdb.com/api/json/v1/1/categories.php"

let isAlreadyFetched = null;// sessionStorage.getItem("fetched")

if (isAlreadyFetched == null) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Data")
            console.log(data)
            console.log("hej")
            localStorage.setItem("dataStore", JSON.stringify(data));
            sessionStorage.setItem("fetched", "true");
        })
        .catch(err => console.error(err))

    const modelData = JSON.parse(localStorage.getItem("dataStore"))
    console.log(modelData[1,2])

    window.location.href = "Home/Index2?/Cases=" + modelData[1,1]
}