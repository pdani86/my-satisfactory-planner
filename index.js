// const g_satisfactory_data from js instead of JSON
let g_content = null;
let g_product_target_div = null;
//let g_data_json = null;


const g_final_target =
[
  ["nuclear-pasta", 1000],
  ["...sculptor", 1000],
  ["ai-expansion-server", 256],
  ["ballistic-warp-drive", 200]
];

const g_target_hours = 20;


function table_begin(o) {o+="<table>";}
function table_end(o) {o+="</table>";}

function table_row_begin(o) {o+="<tr>";}
function table_row_end(o) {o+="</tr>";}

function table_col_begin(o) {o+="<td>";}
function table_col_end(o) {o+="</td>";}

function table_add_header(o, cols) { table_begin(o); for(let elem in cols) {table_col_begin(o); o+=elem; table_col_end(o);} table_end(o);}
function table_add_row(o, cols) {table_begin(o); for(let elem in cols) {table_col_begin(o); o+=elem; table_col_end(o);} table_end(o);}


function find_item_name_by_key_name(key_name) {
	let items = g_satisfactory_data["items"];
	for(let i = 0; i < items.length; ++i) {
		if(items[i].key_name != key_name) continue;
		return items[i].name;
	}
	return null;
}

function get_image_str_for_item(name) {
	if(name == null) {
		return "";
	}
	return "<img width='64' src='images/"+name+".png' />";
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

function create_recipe_list() {
	let div = document.createElement("div");
	let str = "<table>";
	//str += "<tr><th>img</th><th>product</th><th>speed</th></tr>";
	
	let recipes = g_satisfactory_data["recipes"];
	
	for(let ix in recipes) {
		let curRec = recipes[ix];
		//let main_product = cur.products[0][0];
		str += "<td>" + curRec.name + "</td>";
		str += "<td>";
		for(let i=0;i<curRec.products.length;++i) {
			let curItem = curRec.products[i];
			str += get_image_str_for_item_key(curItem[0]);
			str += curItem[1];
		}
		str += "</td>";
		str += "<td>";
		for(let i=0;i<curRec.ingredients.length;++i) {
			let curItem = curRec.ingredients[i];
			str += get_image_str_for_item_key(curItem[0]);
			str += curItem[1];
		}
		str += "</td>";
		str += "</tr>";
	}
	str += "</table>";
	div.innerHTML = str;
	return div;
}

function init_page() {
	g_content = document.getElementById("content");
	create_product_target_div();
	g_content.appendChild(create_recipe_list());
}
