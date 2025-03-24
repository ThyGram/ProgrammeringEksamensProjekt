﻿const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
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



function getMealName(categoryArray)
{
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

function GetMealInfo(mealName, id, index) {
    console.log(mealName)
    mealName = mealName.replace("，︀", ", ") // Add comma again, to search for the proper meal name
    mealName = mealName.replace("aƞd", "&") // Add comma again, to search for the proper meal name
    let isAlreadyFetched2 = localStorage.getItem(mealName)
    if (isAlreadyFetched2 != "true") {
        let url3 = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + mealName
        GetRequest(url3)
            .then(data => {
                let Category = data.meals[0].strCategory
                let Area = data.meals[0].strArea
                let Instructions = data.meals[0].strInstructions
                let Ingredients = IngredientsForMeal(data.meals);

                localStorage.setItem(mealName, true);

                Category = ReplaceSpecificSymbols(Category);
                Area = ReplaceSpecificSymbols(Area);
                Instructions = ReplaceSpecificSymbols(Instructions);
                Ingredients = ReplaceSpecificSymbols(Ingredients);

                let userid = sessionStorage.getItem("User")
                if (userid == null) {
                    userid = 0
                }
                if (index) {
                    window.location.href = "Home/SpecificRecipe?Category=" + Category + "&Area=" + Area + "&Instructions=" + Instructions + "&Ingredients=" + Ingredients + "&recipeId=" + id + "&userId=" + userid;
                }
                else {
                    window.location.href = "SpecificRecipe?Category=" + Category + "&Area=" + Area + "&Instructions=" + Instructions + "&Ingredients=" + Ingredients + "&recipeId=" + id + "&userId=" + userid;

                }
            })
            .catch(err => console.error(err));
    }
    else if (isAlreadyFetched2 == "true") {
        let userid = sessionStorage.getItem("User")
        if (userid == null) {
            userid = 0
        }
        if (index) {
            window.location.href = "Home/SpecificRecipe?Category=" + "no" + "&Area=" + "" + "&Instructions=" + "" + "&Ingredients=" + "" + "&recipeId=" + id + "&userId=" + userid;
        }
        else {
            window.location.href = "SpecificRecipe?Category=" + "no" + "&Area=" + "" + "&Instructions=" + "" + "&Ingredients=" + "" + "&recipeId=" + id + "&userId=" + userid;
        }
        
    }
}
            
async function GetRequest(url)
{
    const fetchResponse = await fetch(url);
    return fetchResponse.json();
}

function MergeArrays(array1, array2)
{
    for (let i = 0; i < 7; i++) { // smaller than 8, because if increased, the amount of meals become too much.
        if (array2[i] != null)
        {
            array1.push(array2[i]);
        }
        
    }
    return array1;
}

function IngredientsForMeal(data)
{
    let AllIngredients = ""
    let AllIngredientsArray = []
    for (let i = 1; i < 21; i++) {
        let ingre = data[0][`strIngredient${i}`]
        let measu = data[0][`strMeasure${i}`]
        if ((ingre != null && ingre && ingre.length > 1 && ingre != undefined)  || (measu != null && measu != undefined && measu.length > 1)) {
            AllIngredientsArray.push(ingre + " " + measu)
        }
    }
    return AllIngredientsArray;
}

function ReplaceSpecificSymbols(MealNames)
{
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

// EVERYTHING BELOW ARE FUNCTIONS USED FOR THE RAZOR VIEWS

function Search(RecipeNames, Id)
{
    let target = document.getElementById("searchtarget").value.toLowerCase();
    const RecipeNameArray = RecipeNames.split(", ");
    const IdArray = Id.split(", ")
    let RecipeIDwithTarget = [];
    for (let i = 0; i < RecipeNameArray.length; i++)
    {
        let mealName = RecipeNameArray[i].toLowerCase()
        mealName = mealName.replace("，︀", ", ") // Add comma again, to search for the proper meal name
        mealName = mealName.replace("aƞd", "&") // Add comma again, to search for the proper meal name
        if (mealName.includes(target))
        {
            RecipeIDwithTarget.push(IdArray[i]);
        }
    }
    window.location.href = "Recipes?mealID=" + RecipeIDwithTarget
}

function FilterCategory(Categories, Id)
{
    const TargetCategory = document.getElementById("CategoryFilter").value;

    const CategoriesArray = Categories.split(", ")
    const IdArray = Id.split(", ")
    var RecipeIDwithTarget = []

    for (let i = 0; i < CategoriesArray.length; i++)
    {
        if (CategoriesArray[i] == TargetCategory)
        {
            RecipeIDwithTarget.push(IdArray[i]);
        }
    }

    window.location.href = "Recipes?mealID=" + RecipeIDwithTarget
}

function FilterArea(Areas, Id) {
    var TargetArea = document.getElementById("AreaFilter").value;

    const AreaArray = Areas.split(", ")
    const IdArray = Id.split(", ")
    var RecipeIDwithTarget = []

    for (let i = 0; i < AreaArray.length; i++) {
        if (AreaArray[i] == TargetArea) {
            RecipeIDwithTarget.push(IdArray[i]);
        }
    }

    window.location.href = "Recipes?mealID=" + RecipeIDwithTarget
}

function ResetFilters() {
    window.location.href = "Recipes?"
}

function AddUser(AllUserEmails) {
    const AllUserEmailsArray = AllUserEmails.split(", ");
    var BoxesFilled = true
    const Email = document.getElementById("Email").value;
    const Firstname = document.getElementById("Firstname").value;
    const Lastname = document.getElementById("Lastname").value;
    const Phonenumber = document.getElementById("Phonenumber").value;
    var EmailExists = false;

    if (Email == "" || Firstname == "" || Lastname == "" || Phonenumber == "") {
        document.getElementById("AccountHeader").innerHTML = "Fill all boxes to make an account!"
        BoxesFilled = false
    }

    if (BoxesFilled) {
        for (let i = 0; i < AllUserEmailsArray.length; i++) {
            if (AllUserEmailsArray[i] == Email) {
                document.getElementById("AccountHeader").innerHTML = "That email is already in use, login to that email if its your account!";
                var EmailExists = true;
                break;
            }
        }
        if (EmailExists == false) {
            window.location.href = "Account2?Email=" + Email + "&Firstname=" + Firstname + "&Lastname=" + Lastname + "&Phonenumber=" + Phonenumber;
        }
    } 
}

function Login(AllUserEmails, AllUserIds) {
    var succes = false;
    const AllUserEmailsArray = AllUserEmails.split(", ");
    const AllUserIdsArray = AllUserIds.split(", ");

    const email = document.getElementById("Email").value;

    for (let i = 0; i < AllUserEmailsArray.length; i++) {
        if (email == AllUserEmailsArray[i]) {
            succes = true
            sessionStorage.setItem("User", AllUserIdsArray[i])
            window.location.href = "Account?userId=" + AllUserIdsArray[i] + "&login=" + true
        }
    }

    if (succes == false) {
        document.getElementById("AccountHeader").innerHTML = "That email isnt in use, and therefore cant be logged into!"
    }
}

function Account() {
    const userId = sessionStorage.getItem("User");
    var login = false;
    if (userId != "null" && userId != null) {
        login = true;
    }
    window.location.href = "Account?UserID=" + userId + "&login=" + login + "&OpenedOnce=" + true;

}

function AdminLogin() {
    UsernameInput = document.getElementById("AdminUsername").value;
    PasswordInput = document.getElementById("AdminPassword").value;

    if (UsernameInput == "Admin" && PasswordInput == "") {
        document.getElementById("LoginAsAdmin").style.display = "none"
        document.getElementById("AdminLoggedin").style.display = "block"
    }
    else {
        document.getElementById("AdminHeader").innerHTML = "The login was incorrect! Try again or go find a good recipe"
    }
}

function ChangeMealShow() {
    const TargetMeal = document.getElementById("MealName").value;
    const Element = document.getElementById(TargetMeal);
    const name = Element.getAttribute("name")
    const PNG = Element.getAttribute("data-PNG")
    const category = Element.getAttribute("data-category")
    const area = Element.getAttribute("data-area")
    const instructions = Element.getAttribute("data-instructions")
    const ingredients = Element.getAttribute("data-ingredients")

    document.getElementById("Name").value = name
    document.getElementById("PNG").value = PNG
    document.getElementById("Category").value = category
    document.getElementById("Area").value = area
    document.getElementById("Instructions").value = instructions
    document.getElementById("Ingredients").value = ingredients
}

function ChangeMeal() {
    let name = document.getElementById("Name").value
    let PNG = document.getElementById("PNG").value
    let Cat = document.getElementById("Category").value
    let Area = document.getElementById("Area").value
    let Instruc = document.getElementById("Instructions").value
    let Ingredi = document.getElementById("Ingredients").value
    window.location.href = "ChangeRecipe?mealName=" + name + "&mealPNG=" + PNG + "&Category=" + Cat + "&Area=" + Area + "&Instructions=" + Instruc + "&Ingredients=" + Ingredi;
}

function addFavorite(UserId, RecipeId) {
    window.location.href = "AddFavorite?userId=" + UserId + "&recipeId=" + RecipeId;
}

function removeFavorite(FavoriteRecipeId) {
    window.location.href = "RemoveFavorite?FavoriteRecipeId=" + FavoriteRecipeId;
}

function Logout() {
    sessionStorage.setItem("User", null)
    Account()
}