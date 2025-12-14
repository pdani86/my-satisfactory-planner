// const g_satisfactory_data from js instead of JSON
let g_content = null;
let g_product_target_div = null;
let g_data_json = null;

const image_dir = "images";
const key_field_name = "key_name";
g_data_json = g_satisfactory_data;

/*
const image_dir = "images/dsp";
const key_field_name = "key";
g_data_json = g_dsp_data;
*/



const g_final_target =
[
  ["nuclear-pasta", 1000],
  ["...sculptor", 1000],
  ["ai-expansion-server", 256],
  ["ballistic-warp-drive", 200]
];


/*
const g_final_target =
[
  ["um", 1000]
  //["...sculptor", 1000],
  //["ai-expansion-server", 256],
  //["ballistic-warp-drive", 200]
];
*/
const g_target_hours = 20;


function table_begin(o) {o+="<table>";}
function table_end(o) {o+="</table>";}

function table_row_begin(o) {o+="<tr>";}
function table_row_end(o) {o+="</tr>";}

function table_col_begin(o) {o+="<td>";}
function table_col_end(o) {o+="</td>";}

function table_add_header(o, cols) { table_begin(o); for(let elem in cols) {table_col_begin(o); o+=elem; table_col_end(o);} table_end(o);}
function table_add_row(o, cols) {table_begin(o); for(let elem in cols) {table_col_begin(o); o+=elem; table_col_end(o);} table_end(o);}



function is_resource(item_name) {
	
	const resources = g_data_json.resources;
	
	for(let ix in resources) {
		const r = resources[ix];
		if(r[key_field_name] == item_name) {
			return true;
		}
	}
	return false;
	/*
	if(item_name.endsWith("-ore")) {
		return true;
	}
	const ores = [
		"coal",
		"sulfur",
		"limestone",
		"bauxite",
		
		"water",
		"crude-oil",
		"nitrogen-gas"
		];
	if(ores.includes(item_name)) {
		return true;
	}
	return false;
	*/
}

function is_resource_recipe(recipe) {
	return (recipe.ingredients.length == 0) || is_resource(recipe.products[0][0]);
}

function filter_recipe(recipe) {
	
	if(is_resource_recipe(recipe)) {
		return false;
	}
	if(recipe.category == "converting") {
		return false;
	}
	if(recipe.name.startsWith("alt-")) {
		return false;
	}
	if(recipe.name.startsWith("reanimated-sam")) {
		return false;
	}
	return true;
}

function find_item_recipe(item_key) {
	let recipes = g_data_json["recipes"];
	for(let i = 0; i < recipes.length; ++i) {
		let recipe = recipes[i];
		let products = recipe.products;
		if(products[0][0] != item_key) continue;
		if(!filter_recipe(recipe)) {
			continue;
		}
		return recipe;
	}
	return null;
}

function find_item_name_by_key_name(key_name) {
	let items = g_data_json["items"];
	for(let i = 0; i < items.length; ++i) {
		if(items[i][key_field_name] != key_name) continue;
		return items[i].name;
	}
	if(!("fluids" in g_data_json)) {
		return null;
	}
	let fluids = g_data_json["fluids"];
	for(let i = 0; i < fluids.length; ++i) {
		if(fluids[i][key_field_name] != key_name) continue;
		return fluids[i].name;
	}
	return null;
}

function get_image_str_for_item(name) {
	if(name == null) {
		return "";
	}
	return "<img width='32' src='" + image_dir + "/"+name+".png' />";
}

function get_image_str_for_item_key(key_name) {
	return get_image_str_for_item(find_item_name_by_key_name(key_name));
}

function update_product_target_div(target, scale) {
	g_product_target_div.innerHTML = "";
	let str = "<table>";
	str += "<tr><th>img</th><th>product</th><th>speed</th></tr>";
	for(let i = 0; i < target.length; ++i) {
		let cur = target[i];
		let item_name = find_item_name_by_key_name(cur[0]);
		str += "<tr>";
		str += "<td>";
		if(item_name!=null) {
			str += get_image_str_for_item(item_name);
		}
		str += "</td>";
		str += "<td>" + cur[0] + "</td>";
		str += "<td>" + (cur[1]*scale).toFixed(4) + " /min" + "</td>";
		str += "</tr>";
	}
	str += "</table>";
	g_product_target_div.innerHTML = str;
}

function create_product_target_div() {
	g_product_target_div = document.createElement("div");
	g_product_target_div.setAttribute("id", "product_target_div");
	
	g_content.appendChild(g_product_target_div);
	update_product_target_div(g_final_target, 1.0 / (60.0 * g_target_hours));
}

// function load_data_json() {}

function create_recipe_column(item_list, time) {
	let str = "";
	for(let i=0;i<item_list.length;++i) {
		const curItem = item_list[i];
		str += get_image_str_for_item_key(curItem[0]);
		str += curItem[1] + " (" + (curItem[1]*(60.0/time)).toFixed(0) + ")";
	}
	return str;
}

function create_recipe_list() {
	let div = document.createElement("div");
	let str = "<table>";
	//str += "<tr><th>img</th><th>product</th><th>speed</th></tr>";
	
	let recipes = g_data_json["recipes"];
	
	for(let ix in recipes) {
		str += "<tr>";
		let curRec = recipes[ix];
		let time = curRec.time;
		//let main_product = cur.products[0][0];
		str += "<td>" + curRec.name + "</td>";
		str += "<td>";
		str += create_recipe_column(curRec.products, time);
		str += "</td>";
		str += "<td>";
		str += create_recipe_column(curRec.ingredients, time);
		str += "</td>";
		str += "</tr>";
	}
	str += "</table>";
	div.innerHTML = str;
	return div;
}


function add_to_item_speed_list(res, item, speed) {
	//console.log("ADD --- " + item + " - " + speed);
	for(let i = 0; i < res.length; ++i) {
		let r = res[i];
		if(r[0] == item) {
			r[1] += speed;
			return;
		}
	}
	res.push([item, speed]);
}


/*
var in_out_list = {
	"motor": {
		//"speed": 50,
		"in": {"stator": 100, "rotor", 100}
	}
};
*/


function add_to_inout(res, recipe, item, speed) {
	if(!(item in res)) {
		res[item] = {
			"speed": speed,
			"recipe": recipe,
			"in": {}
		};
	} else {
		res[item].speed += speed;
	}
}

function add_to_inout_ingredient(res, recipe, target_item, in_item, in_speed) {
	if(!(target_item in res)) {
		res[target_item] = {
			"speed": 0,
			"recipe": recipe,
			"in": {}
		};
	}
	let r = res[target_item];
	if(in_item in r["in"]) {
		r["in"][in_item] += in_speed;
	} else {
		r["in"][in_item] = in_speed;
	}
}

function find_array_value(arr, val) {
	for(let key in arr) {
		if(arr[key][0] == val) {
			return arr[key];
		}
	}
	return null;
}

function fill_inout_outs(r) {
	for(out_key in r) {
		let recipe = r[out_key].recipe;
		let out_speed = r[out_key].speed;
		let product_count = null;
		if(recipe) { product_count = recipe.products[0][1]; }
		for(in_key in r[out_key]["in"]) {
			if(in_key in r) {
				let in_o = r[in_key];
				if(!("out" in in_o)) {
					in_o["out"] = {};
				} 
				let oo = in_o["out"];
				let elem = find_array_value(recipe.ingredients, in_key);
				let in_count = elem[1];
				let in_speed = out_speed / product_count * in_count;
				if(out_key in oo) {
					oo[out_key] += in_speed;
				} else {
					oo[out_key] = in_speed;
				}
			} else {
				// TODO
			}
		}
	}
}

function check_for_loop(stack, item_key) {
	for(let i in stack) {
		if(stack[i][0] == item_key) {
			return true; // loop
		}
	}
	return false;
}

function print_calc_stack(needs) {
	console.log("-----------");
	for(let i in needs) {
		console.log("STACK["+i+"] " + needs[i][0] + " - " + needs[i][1]);
	}
	console.log("-----------");
}

function calc_plan(target) {
	const b_log = false;
	
	let result = [];
	let in_out_list = {};
	let side_products = {};
	
	let needs = target.slice(); // no ref
	
	const depth_limit = 1000;
	const N_limit = 10000;
	let cnt = 0;
	
	while(needs.length > 0) {
		++cnt;
		
		if(b_log) { print_calc_stack(needs); }
		
		if(needs.length > depth_limit) {
			console.log("depth_limit reached");
			break;
		}
		if(cnt > N_limit) {
			console.log("cycle limit reached");
			break;
		}
		
		let cur = needs.pop();
		let item_key = cur[0];
		let item_speed = cur[1];
		add_to_item_speed_list(result, item_key, item_speed);
		
		/*
		if(is_resource(item_key)) {
			console.log("ORE - " + item_key);
			continue;
		}*/
		
		let recipe = find_item_recipe(item_key);
		
		if(null == recipe) {
			console.log("recipe not found '" + item_key + "'");
			add_to_inout(in_out_list, null, item_key, item_speed);
			continue;
		}
		let product_per_recipe = recipe.products[0][1];
		let recipe_multiplier = item_speed / product_per_recipe;
		
		for(let i = 1; i < recipe.products.length; ++i) {
			let side_prod = recipe.products[i];
			let side_speed = recipe_multiplier * side_prod[1];
			side_products[side_prod[0]] = side_speed;
		}
				
		let ingredients = recipe.ingredients;
		
		add_to_inout(in_out_list, recipe, item_key, item_speed);
		
		for(let i = 0; i < ingredients.length; ++i) {
			let ing_key = ingredients[i][0];
			let ing_speed = recipe_multiplier * ingredients[i][1];
			if(check_for_loop(needs, ing_key)) {
				console.log("LOOP!");
			} else {
				add_to_inout_ingredient(in_out_list, recipe, item_key, ing_key, ing_speed);
				add_to_item_speed_list(needs, ing_key, ing_speed);
			}
		}
		
	}
	
	fill_inout_outs(in_out_list);
	
	return {
		"list": result,
		"inout": in_out_list,
		"side_products": side_products
	};
}

function calc_plan_tree(target) {
	
	let resource_prod = {};
	let intermediate_prod = {};
	let net_prod = {};
	
	
	let tree = {};
	
	let needs = target.slice(); // no ref
	
	// TODO
	
	return tree;
}

function create_plan_div() {
	
}

function print_plan(plan) {
	for(let i = 0; i < plan.length; ++i) {
		let p = plan[i];
		let name = p[0];
		let speed = p[1];
		console.log(name + " - " + speed);
	}
}

function init_page() {
	g_content = document.getElementById("content");
	create_product_target_div();
	g_content.appendChild(create_recipe_list());
	
	//let plan = calc_plan([["motor", 100]]);
	let plan = calc_plan([["fused-modular-frame", 1]]);
	//let plan = calc_plan([["heavy-modular-frame", 1]]);
	
	console.log(plan);
	//print_plan(plan);
}
