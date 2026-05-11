const student = JSON.parse(localStorage.getItem("student"));

if (!student) {
    alert("Session expired");
    window.location.href = "index.html";
}

const userRank = student.rank;

// 🔥 LOAD CATEGORIES
async function loadCategories(){

    const { data, error } = await supabase
        .from("levels_master")
        .select("category, rank");

    if (error) {
        console.error("Category fetch error:", error);
        return;
    }

    const allowed = data.filter(d => d.rank <= userRank);

    console.log("DB categories:", data);
    console.log("Allowed:", allowed);

    const categories = [...new Set(
        allowed.map(d => d.category).filter(c => c)
    )];

    let dropdown = document.getElementById("category");
    dropdown.innerHTML = "<option value=''>Category</option>";

    categories.forEach(c => {
        let op = document.createElement("option");
        op.value = c;
        op.text = c;
        dropdown.appendChild(op);
    });
}

// 🔥 LOAD LEVELS
async function updateLevels(){

    let category = document.getElementById("category").value;
    let levelDropdown = document.getElementById("level");

    levelDropdown.innerHTML = "<option value=''>Level</option>";

    const { data, error } = await supabase
        .from("levels_master")
        .select("level_name,Dropdown_names, rank, category")
        .eq("category", category)
        .order("rank", { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    const allowed = data.filter(l => l.rank <= userRank);

    allowed.forEach((l, index) => {
        let op = document.createElement("option");

op.value = l.level_name;
op.text = l.Dropdown_names;

        levelDropdown.appendChild(op);
    });
};


function checkAnswers(){

let inputs=document.querySelectorAll(".answer");
let results=document.querySelectorAll(".result");

inputs.forEach((i,index)=>{

let v=i.value.trim();

if(v===""){
results[index].innerHTML="";
return;
}

if(parseInt(v)===answers[index]){
results[index].innerHTML="✔";
results[index].className="result correct";
}else{
results[index].innerHTML="✘";
results[index].className="result wrong";
}

});

}

function resetAnswers(){
document.querySelectorAll(".answer").forEach(i=>i.value="");
document.querySelectorAll(".result").forEach(i=>i.innerHTML="");
}


function saveCategory(){
  let cat = document.getElementById("category").value;
  localStorage.setItem("category", cat);
}

function saveLevel(){
  let lvl = document.getElementById("level").value;
  localStorage.setItem("level", lvl);
}
document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
});