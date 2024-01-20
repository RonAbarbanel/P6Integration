var p6_output = {
    'header': [],
    'WBS_headers': [],
    'WBS': [],
    'middle': [],
    'project_headers': [],
    'project_lines': [],
    'footer': []
};
var p6_proj_cols = [];
var p6_wbs_cols = [];
var p6_proj_cells = [];
var p6_wbs_cells = [];

function parseP6(contents) {
    // Split the file into lines
    var last_line = '';
    var parts = [];
    var lines = contents.split('\n');
    var state = 'header';

    // Get the rest of the file, and make sure it's the right length
    for (var i = 0; i < lines.length; i++) {
        // add the line to the output at the end of the array
        p6_output[state].push(lines[i]);
        // Parse the line based on a TAB delimiter
        parts = lines[i].split('\t');
        // See if we are done with WBS lines
        if (state == 'WBS' && parts[0] != '%R') {
            // Remove the last line as it is not part of the WBS
            last_line = p6_output[state].pop();
            state = 'middle';
            // Add as the first line of the project headers
            p6_output[state].push(last_line);
        }
        // Get the rest of the file
        if (state == 'project_lines' && parts[0] != '%R') {
            // Remove the last line as it is not part of the project
            var last_line = p6_output[state].pop();
            state = 'footer';
            // Add as the first line of the footer
            p6_output[state].push(last_line);
        }
        // Check for %T PROJWBS
        if (state == 'header' && parts[0] == '%T' && parts[1] == 'PROJWBS\r') {
            state = 'WBS_headers';
        }
        // Get the WBS headers
        if (state == 'WBS_headers' && parts[0] == '%F') {
            p6_wbs_cols = [...parts];
            state = 'WBS';
        }
        // Get the WBS lines
        if (state == 'WBS' && parts[0] == '%R') {
            p6_wbs_cells.push([...parts]);
        }
        // Check for %T TASK
        if (state == 'middle' && parts[0] == '%T' && parts[1] == 'TASK\r') {
            state = 'project_headers';
        }
        // Get the project headers
        if (state == 'project_headers' && parts[0] == '%F') {
            p6_proj_cols = [...parts];
            state = 'project_lines';
        }
        // Get the project lines
        if (state == 'project_lines' && parts[0] == '%R') {
            p6_proj_cells.push([...parts]);
        }
        $('#output').append($('<p>').text(lines[i]));
    }
    console.log(p6_proj_cols);
    console.log(p6_wbs_cols);
    // If we get here, we're good! 
    return '<h1>This is a valid P6 file!<h1>';
}

function loadP6File(){
    // Using jQuery, get the file so we can read it
    var file = $('#p6-input').prop('files')[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        // When the file is loaded, parse it
        var contents = e.target.result;
        var p6 = parseP6(contents);
        // And display it
        $('#output').append(p6);
    };
    reader.readAsText(file);
}

$(document).ready(function() {
    console.log('We are in business!');
    $('#p6-input').change(loadP6File);
});
