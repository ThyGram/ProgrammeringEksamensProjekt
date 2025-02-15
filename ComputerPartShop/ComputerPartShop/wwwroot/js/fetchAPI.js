//Fetch computer parts from API
let url = ''

let isAlreadyFetched = sessionStorage.getItem("fetched")

if (isAlreadyFetched == null)
{
    fetch(url)
    .then(response => response.json)
    .then(data =>
    {
        console.log("Data")
        console.log(data)
        relevantInfo = [] = {
            FirstName: data.results.name.First
            LastName: data.results.name.Last
            Email: data.results.Email
            PhoneNumber: data.results.PhoneNumber
        }
        localStorage.setItem("dataStore", JSON.stringify(relevantInfo)
        sessionStorage.setItem("fetched", "true");
    })
        .catch(err => console.error(err))

    const modelData = JSON.parse(localStorage.getItem("dataStore"))

    window.location.href = "Home/Index2?/Name=" + modelData.Name + "&Age=" + modelData.Age
}