const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
if (sessionStorage.getItem("isAlreadyFetched") == null)
{
    sessionStorage.setItem("isAlreadyFetched", false)
}
let isAlreadyFetched = JSON.parse(sessionStorage.getItem("isAlreadyFetched"));

if (isAlreadyFetched == false)
{
    GetRequest(url)
        .then(data => {
            let categories = data.categories.map(data => data.strCategory)
            console.log(categories)
            getMealName(categories);
        })
        .catch(err => console.error(err))
}

function getMealName(categoryArray) {
    if (isAlreadyFetched == false) {
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
                        sessionStorage.setItem("isAlreadyFetched", true);
                        storedMealNames = ReplaceSpecificSymbols(storedMealNames)
                        window.location.href = "Home/Index2?mealName=" + storedMealNames + "&mealPNG=" + storedMealPNGs;
                    }
                })
                .catch(err => console.error(err))
        }
    }
}

function GetMealInfo(mealName, id) {
    console.log(mealName)
    mealName = mealName.replace("，︀", ", ") // Add comma again, to search for the proper meal name
    mealName = mealName.replace("aƞd", "&") // Add comma again, to search for the proper meal name
    let isAlreadyFetched2 = sessionStorage.getItem(mealName)
    if (!isAlreadyFetched2 || isAlreadyFetched2 == null) {
        let url3 = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + mealName
        GetRequest(url3)
            .then(data => {
                let Category = data.meals[0].strCategory
                let Area = data.meals[0].strArea
                let Instructions = data.meals[0].strInstructions
                let Ingredients = IngredientsForMeal(data.meals);

                sessionStorage.setItem(mealName, true);

                Category = ReplaceSpecificSymbols(Category);
                Area = ReplaceSpecificSymbols(Area);
                Instructions = ReplaceSpecificSymbols(Instructions);
                Ingredients = ReplaceSpecificSymbols(Ingredients);

                window.location.href = "SpecificRecipe?Category=" + Category + "&Area=" + Area + "&Instructions=" + Instructions + "&Ingredients=" + Ingredients + "&id=" + id;
            })
            .catch(err => console.error(err));
    }
}
            
async function GetRequest(url) {
    const fetchResponse = await fetch(url);
    return fetchResponse.json();
}

function MergeArrays(array1, array2) {
    for (let i = 0; i < 7; i++) { // smaller than 8, because if increased, the amount of meals become too much.
        if (array2[i] != null)
        {
            array1.push(array2[i]);
        }
        
    }
    return array1;
}

function IngredientsForMeal(data) {
    let AllIngredients = ""
    for (let i = 1; i < 21; i++) {
        let ingre = data[0][`strIngredient${i}`]
        let measu = data[0][`strMeasure${i}`]
        if ((ingre != null && ingre && undefined && ingre.length != 0)  || (measu != null && measu != undefined && measu.length != 0)) {
            AllIngredients += data[0][`strIngredient${i}`] + " " + data[0][`strMeasure${i}`] + "，︀"
        }
    }
    return AllIngredients;
}

function ReplaceSpecificSymbols(MealNames) {
    if (Array.isArray(MealNames)) {
        for (let i = 0; i < MealNames.length; i++) {
            MealNames[i] = MealNames[i].replace("&", "aƞd"); // Avoid mistakes from &
            MealNames[i] = MealNames[i].replace(", ", "，︀"); // Avoid mistakes from ,


        }
    }
    else {
        MealNames = MealNames.replace("&", "aƞd");
        MealNames = MealNames.replace(", ", "，︀");
    }
    return MealNames;
}