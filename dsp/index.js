let g_data_json = g_dsp_data;
let g_content = null;

function ch_build_clicked() {
	// console.log("clicked");
	g_content.classList.toggle("show-building-ing");
}

const image_dir = "../images/dsp";
const key_field_name = "key";


function table_begin(o) {o+="<table>";}
function table_end(o) {o+="</table>";}

function table_row_begin(o) {o+="<tr>";}
function table_row_end(o) {o+="</tr>";}

function table_col_begin(o) {o+="<td>";}
function table_col_end(o) {o+="</td>";}

function table_add_header(o, cols) { table_begin(o); for(let elem in cols) {table_col_begin(o); o+=elem; table_col_end(o);} table_end(o);}
function table_add_row(o, cols) {table_begin(o); for(let elem in cols) {table_col_begin(o); o+=elem; table_col_end(o);} table_end(o);}

function is_resource(item_key) {
	const resources = g_data_json["resources"];
	for(let i=0;i<resources.length;++i) {
		const r = resources[i];
		//if(r.key == item_key) {
		if(r.item == item_key) {
			return true;
		}
	}
	return false;
}

function find_item_recipe(item_key) {
	let recipes = g_data_json["recipes"];
	for(let i = 0; i < recipes.length; ++i) {
		let recipe = recipes[i];
		let products = recipe.products;
		if(products[0][0] != item_key) continue;
		/*
		if(!filter_recipe(recipe)) {
			continue;
		}*/
		return recipe;
	}
	return null;
}

function find_item_by_key_name(key) {
	let items = g_data_json["items"];
	for(let i = 0; i < items.length; ++i) {
		if(items[i][key_field_name] != key) continue;
		return items[i];
	}
	return null;
}

function find_item_name_by_key_name(key) {
	let item = find_item_by_key_name(key);
	if(item == null) return null;
	return item.name;
}

function get_image_str_for_item(name) {
	if(name == null) {
		return "";
	}
	return "<img width='48' src='" + image_dir + "/"+name+".png' />";
}

function get_image_str_for_item_key(key_name) {
	let str = "";
	str += "<a href='#" + "item_row_" + key_name + "'>";
	str += get_image_str_for_item(find_item_name_by_key_name(key_name));
	str += "</a>";
	return str;
}


function find_recipes_for_product(product_name) {
	let result = [];
	const recipes = g_data_json.recipes;
	for(let i=0;i<recipes.length;++i) {
		const r = recipes[i];
		const products = r.products;
		for(let j=0;j<products.length;++j) {
			const p = products[j];
			if(p.name == product_name) {
				result.push(r);
			}
		}
	}
	
	return result;
}

function find_recipes_for_ingredient(item_key) {
	let result = [];
	const recipes = g_data_json.recipes;
	for(let i=0;i<recipes.length;++i) {
		const r = recipes[i];
		
		// filter buildings
		/*
		const item = find_item_by_key_name(r.products[0].name);
		if(item.category == "building") {
			continue;
		}
		*/
		
		const ingredients = r.ingredients;
		for(let j=0;j<ingredients.length;++j) {
			const ing = ingredients[j];
			if(ing.name == item_key) {
				result.push(r);
			}
		}
	}
	
	return result;
}


function create_ingredient_column(item_list, time) {
	let str = "";
	for(let i in item_list) {
		const curItem = item_list[i];
		const name = curItem.name;
		const amount = curItem.amount;
		str += get_image_str_for_item_key(name);
		str += amount + " (" + (amount*(60.0/time)).toFixed(0) + ")";
	}
	return str;
}

function create_product_column(item_list, time) {
	return create_ingredient_column(item_list, time);
}

function create_recipe_row(rec) {
	let str = "";
	str += "<td>";
	str += rec.name + " (" + rec.key + ")";
	str += "</td>";
	str += "<td>";
	str += rec.time /*.toFixed(2)*/ + " s";
	str += "</td>";
	str += "<td>";
	str += create_product_column(rec.products, rec.time);
	str += "</td>";
	str += "<td>";
	str += create_ingredient_column(rec.ingredients, rec.time);
	str += "</td>";
	return str;
}


function is_building_item(item_name) {
	const item = find_item_by_key_name(item_name)
	if(!item) return false;
	return item.category == "building";
}

function is_building_recipe(r) {
	return is_building_item(r.products[0].name);
}


function create_recipe_list_table(recipes, classes) {
	str = "";
	if(!classes) classes = "";
	str += "<table class='" + classes + "'>";
	for(let ii=0;ii<recipes.length;++ii) {
		const rr = recipes[ii];
		const is_building = is_building_recipe(rr);
		if(is_building) {
			str += "<tr class='building'>";
		} else {
			str += "<tr>";
		}
		
		str += create_recipe_row(rr);
		str += "</tr>";
	}
	str += "</table>";
	return str;
}

function create_item_list() {
	let div = document.createElement("div");
	let str = "<table>";
	//str += "<tr><th>img</th><th>product</th><th>speed</th></tr>";
	
	const recipes = g_data_json["recipes"];
	const items = g_data_json.items;
	
	for(let ix in items) {
		const curItem = items[ix];
		const itemName = curItem.name;
		const itemKey = curItem.key;
		const category = curItem.category;
		const row = curItem.row;
		
		const is_building = category == "building";
		let isResource = false;
		if(!is_building) {
			isResource = is_resource(itemKey);
		}
		
		const item_recipes = find_recipes_for_product(itemKey);
		
		//const time = curRec.time;
		
		let classes = [];
		if(is_building) classes.push("building");
		if(isResource) classes.push("resource");
		
		const image_str = get_image_str_for_item_key(itemKey);
		const row_id = "item_row_" + itemKey;
		
		str += "<tr" + " id=\"" + row_id + "\"" + " class=\"" + classes.join(" ") + "\" >";
			str += "<td>" + itemName + " (" + itemKey + ")" + "</td>";
			
			str += "<td>";
			str += image_str;
			str += "</td>";
			
			str += "<td>";
			str += create_recipe_list_table(item_recipes);
			str += "</td>";
			
			str += "<td class='ingredients_col'>";
			str += create_recipe_list_table(find_recipes_for_ingredient(itemKey));
			str += "</td>";
		str += "</tr>";
	}
	str += "</table>";
	div.innerHTML = str;
	return div;
}


function create_plan(target) {
	const recipes = g_data_json.recipes;
	
	let plan = {};
	let needs = target.slice(); // no ref
	
	while(needs.length > 0) {
		const product_and_amount = needs.pop();
		const product = product_and_amount[0];
		const amount = product_and_amount[1];
		let r = find_recipes_for_product(product);
		// TODO
		console.log(r);
	}
	return plan;
}

function init_page() {
	g_content = document.getElementById("content");
	//g_content.appendChild(create_recipe_list());
	g_content.appendChild(create_item_list());
	
	let target = [["un", 100]]; // universe matrix, 100/min
	
	console.log(create_plan(target));
	
	//console.log(find_recipes_for_product("un"));
}
