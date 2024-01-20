var xl_wbs = {};

function parseWBS(xl) {
    // Pull unique WBS paths
    xl.forEach(row => {
        // Get the WBS path as a string
        var orig_path = row['WBS Path'].toString();
        // replace any double . with single .
        var path = orig_path.replace('..', '.');
        // To get the id we need re remove all the .
        var wbs_id = path.replace(/\./g, '');
        var name = row['WBS Name'];
        // Get the last part of the path after the last .
        var short_name = path.substring(path.lastIndexOf('.') + 1);
        // Strip off everything after and including the last .
        var parent_wbs_id = path.substring(0, path.lastIndexOf('.'));
        var parent_wbs_id = parent_wbs_id.replace(/\./g, '');
        // Add the WBS to the list
        xl_wbs[wbs_id] = {
            'wbs_id': wbs_id,
            'short_name': short_name,
            'parent_wbs_id': parent_wbs_id,
            'name': name,
            'orig_path': orig_path,
        };
        // Check that the parent exists
        if (!(parent_wbs_id in xl_wbs)) {
            // Add the parent (it may get overwritten later)
            xl_wbs[parent_wbs_id] = {
                'wbs_id': 'unknown',
                'short_name': 'MARSJV',
                'parent_wbs_id': 'unknown',
                'name': 'UPMC Presbyterian Mechanical & Plumbing',
                'orig_path': 'unknown',
            };
        }
    });
    // Reorder the WBS with incrementing ids
    var wbs = {};
    var old_new_id = {};
    var wbs_id = 2;
    // Loop through the WBS
    for (var key in xl_wbs) {
        // Only do this for non unknown WBS
        // if (xl_wbs[key]['wbs_id'] == 'unknown') continue;
        // Add the WBS to the list
        wbs[wbs_id] = xl_wbs[key];
        // Save the old and new ids
        old_new_id[key] = wbs_id;
        // Increment the id
        wbs_id++;
    }
    console.log(old_new_id);
    // Loop through the WBS again to update the parent ids
    for (var key in wbs) {
        // Only do this for non unknown WBS
        if (wbs[key]['wbs_id'] == 'unknown') continue;
        // Update the parent id
        wbs[key]['parent_wbs_id'] = old_new_id[wbs[key]['parent_wbs_id']];
    }
    // Save the new WBS
    xl_wbs = wbs;
}

function loadXLFile(){
    // Using jQuery, get the file so we can read it
    var file = $('#xl-input').prop('files')[0];
    // Check that the filename ends in .xls or .xlsx
    var filename = file.name;
    var ext = filename.split('.').pop();
    if (ext != 'xls' && ext != 'xlsx') {
        alert('Please select a valid Excel file.');
        return;
    }
    // Open the excel file so we can read it
    var reader = new FileReader();
    reader.onload = function(e) {
        // When the file is loaded, parse it
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});
        
        // Use XLSX to read the data
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        var xl = XLSX.utils.sheet_to_json(worksheet);
        // Create WBS
        var wbs = parseWBS(xl);
    }
    reader.readAsArrayBuffer(file);
}

$(document).ready(function() {
    console.log('We are in business!');
    $('#xl-input').change(loadXLFile);
});
