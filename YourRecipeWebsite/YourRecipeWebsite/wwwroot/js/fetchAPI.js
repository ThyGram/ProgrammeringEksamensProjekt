/*let url = "https://www.themealdb.com/api/json/v1/1/categories.php"

let isAlreadyFetched = null;// sessionStorage.getItem("fetched")
let isAlreadyFetched2 = null
let isAlreadyFetched3 = null

if (isAlreadyFetched == null) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            relevantInfo = {
                Category: data.categories.map(AllCategories)
            }
            console.log("gggg")
            sessionStorage.setItem("dataStore", JSON.stringify(relevantInfo));
            sessionStorage.setItem("fetched", "true");
            const modelData = JSON.parse(sessionStorage.getItem("dataStore"))
            console.log("modelData")
            console.log(modelData)
            if (modelData != null) {
                FindMealName(modelData.Category)
            }
        })
        .catch(err => console.error(err))
}

function FindMealName(categoryArray)
{
    console.log("IM IN")
    let done = true
    for (let i = 0; (i < categoryArray.length) && (done == true); i++)
    {
        done = false;
        let url2 = "https://www.themealdb.com/api/json/v1/1/filter.php?c=" + categoryArray[i];
        if (isAlreadyFetched2 == null) {
            fetch(url2)
                .then(response => response.json())
                .then(data => {
                    relevantInfo = {
                        Mealname: data.meals.map(AllNames),
                    }
                    let storedData = JSON.parse(sessionStorage.getItem("dataStore2"));
                    sessionStorage.setItem("dataStore2", JSON.stringify(relevantInfo) + storedData);
                    sessionStorage.setItem("fetched2", "true");
                    done = true;
                    if (i == categoryArray.length - 1) {
                        const modelData2 = JSON.parse(sessionStorage.getItem("dataStore2"));
                        console.log("ModelData2");
                        console.log(modelData2);
                        if (modelData2 != null) {
                            FindRemainingMealInfo(modelData2.Mealname);
                        }
                    }
                })
                .catch(err => console.error(err))
        }
    }
    
}

function FindRemainingMealInfo(mealNameArray) {
    console.log("IM IN")
    for (let i = 0; i < mealNameArray.length; i++) {
        let url3 = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + mealNameArray[i]
        if (isAlreadyFetched3 == null) {
            fetch(url3)
                .then(response => response.json())
                .then(data => {
                    relevantInfo = {
                        Mealname: data.meals.map(AllNames),
                        Area: data.meals.map(AllAreas),
                        Instructions: data.meals.map(AllInstructions),
                        Ingredient: data.meals.map(Ingredients)
                    }
                    localStorage.setItem("dataStore3", JSON.stringify(relevantInfo));
                    sessionStorage.setItem("fetched3", "true");
                })
                .catch(err => console.error(err))

            
        }
    }
    const modelData3 = JSON.parse(localStorage.getItem("dataStore3"))
    //window.location.href = "Home/Index2?" + modelData.strMeal + "&Category=" + categoryArray[i] + "&Area=" + dea + "&Instructions=" + deas + "&Ingredients=" + modelData
    console.log("ModelData3")
    console.log(modelData3)
}


        
function AllCategories(data) {
    return data.strCategory
}
function AllNames(data) {
    return data.strMeal
}
function AllAreas(data) {
    return data.strArea
}
function AllInstructions(data) {
    return data.strInstructions
}

function Ingredients(data) {
    return (
        data.strIngredient1 + data.strMeasure1,
        data.strIngredient2 + data.strMeasure2,
        data.strIngredient3 + data.strMeasure3,
        data.strIngredient4 + data.strMeasure4,
        data.strIngredient5 + data.strMeasure5,
        data.strIngredient6 + data.strMeasure6,
        data.strIngredient7 + data.strMeasure7,
        data.strIngredient8 + data.strMeasure8,
        data.strIngredient9 + data.strMeasure9,
        data.strIngredient10 + data.strMeasure10,
        data.strIngredient11 + data.strMeasure11,
        data.strIngredient12 + data.strMeasure12,
        data.strIngredient13 + data.strMeasure13,
        data.strIngredient14 + data.strMeasure14,
        data.strIngredient15 + data.strMeasure15,
        data.strIngredient16 + data.strMeasure16,
        data.strIngredient17 + data.strMeasure17,
        data.strIngredient18 + data.strMeasure18,
        data.strIngredient19 + data.strMeasure19,
        data.strIngredient20 + data.strMeasure20
    )
}*/


const url = "https://www.themealdb.com/api/json/v1/1/categories.php"

GetRequest(url)
    .then(data => {
        let categories = data.categories.map(data => data.strCategory)
        console.log(categories)
        if (categories != null) {
            getMealName(categories);
        }
    })
    .catch(err => console.error(err))

function getMealName(categoryArray) {
    console.log("IM IN")
    let storedMealNames = [];
    let storedMealPNGs = [];

    for (let i = 0; i < categoryArray.length; i++) {
        let url2 = "https://www.themealdb.com/api/json/v1/1/filter.php?c=" + categoryArray[i];
        GetRequest(url2)
            .then(data => {
                let mealName = data.meals.map(data => data.strMeal);
                storedMealNames = MergeArrays(storedMealNames, mealName);
                let mealPNG = data.meals.map(data => data.strMealThumb)
                storedMealPNGs = MergeArrays(storedMealPNGs, mealPNG)

                if (i == categoryArray.length - 1) {
                    relevantMealInfo = {
                        mealName : storedMealNames,
                        mealPNG : storedMealPNGs 
                    }
                    sessionStorage.setItem("mealData", JSON.stringify(relevantMealInfo));
                    mealData = JSON.parse(sessionStorage.getItem("mealData"));
                    console.log("mealData");
                    console.log(mealData);
                    if (storedMealNames != null) {

                    }
                }
                    
                    
            })
            .catch(err => console.error(err))

    }
}
//window.location.href = "Home/Index2?" + modelData.strMeal + "&Category=" + categoryArray[i] + "&Area=" + dea + "&Instructions=" + deas + "&Ingredients=" + modelData
//console.log("ModelData3")
/*function FindMealInfo(mealNameArray)
{
    let storedMealInfo = []
    for (let i = 0; i < 5; i++) {
        let url3 = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + mealNameArray[i]
        GetRequest(url3)
            .then(data => {
                relevantMealInfo = {
                    Mealname: data.meals.map(data => data.strMeal),
                    Area: data.meals.map(data => data.strArea),
                    Instructions: data.meals.map(data => data.strInstructions),
                    Ingredient: data.meals.map(Ingredients)
                }

                storedMealInfo = MergeArrays(storedMealInfo, relevantMealInfo);
                if (i == mealNameArray.length - 1) {
                    console.log("ModelData2");
                    console.log(storedMealInfo);
                    if (storedMealInfo != null) {
                        console.log(storedMealInfo);
                    }
                }


            })
            .catch(err => console.error(err))

    }
}*/


async function GetRequest(url) {
    const fetchResponse = await fetch(url);
    return fetchResponse.json();
}
function MergeArrays(array1, array2) {
    for (let i = 0; i < array2.length; i++) {
        array1.push(array2[i]);
    }
    return array1;
}

function Ingredients(data) {
    return (
        data.strIngredient1 + data.strMeasure1,
        data.strIngredient2 + data.strMeasure2,
        data.strIngredient3 + data.strMeasure3,
        data.strIngredient4 + data.strMeasure4,
        data.strIngredient5 + data.strMeasure5,
        data.strIngredient6 + data.strMeasure6,
        data.strIngredient7 + data.strMeasure7,
        data.strIngredient8 + data.strMeasure8,
        data.strIngredient9 + data.strMeasure9,
        data.strIngredient10 + data.strMeasure10,
        data.strIngredient11 + data.strMeasure11,
        data.strIngredient12 + data.strMeasure12,
        data.strIngredient13 + data.strMeasure13,
        data.strIngredient14 + data.strMeasure14,
        data.strIngredient15 + data.strMeasure15,
        data.strIngredient16 + data.strMeasure16,
        data.strIngredient17 + data.strMeasure17,
        data.strIngredient18 + data.strMeasure18,
        data.strIngredient19 + data.strMeasure19,
        data.strIngredient20 + data.strMeasure20
    )
}