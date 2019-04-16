function postRefreshPage (rowData) 
{
  var theForm, newInput;
  // Start by creating a <form>
  theForm = document.createElement('form');
  theForm.action = '/staff';
  theForm.method = 'post';
  // Next create the <input>s in the form and give them names and values
  for(var i =0;i<rowData.length-1;i=i+1){
    newInput = document.createElement('input');
    newInput.type = 'hidden';
    newInput.name = 'data';               
    newInput.value = rowData[i];
    // Now put it together...
    //TODO: create hidden attr to identify action
    theForm.appendChild(newInput);
  };
  // ...and it to the DOM...
  document.getElementById('hidden_form_container').appendChild(theForm);
  // ...and submit it
  theForm.submit();
}
$().ready(function(){ 
$('.editbtn').click(function () { 
  console.log('lllll');     
  var currentTD = $(this).parents('tr').find('td');
  if ($(this).html() == 'Edit') 
  {
    $.each(currentTD, function () { $(this).prop('contenteditable', true); });
  }
  else 
  {
    $.each(currentTD, function () { $(this).prop('contenteditable', false);});
  }
    
  if($(this).html() == 'Save')
  {
    var rowData = currentTD.map(function() { return $(this).text(); }).get();
    postRefreshPage(rowData); 
    //- $.ajax({
    //- type: "GET",
    //- url: '/test',
    //- data: {rowData:rowData},
    //- success: function (result) {
    //-  console.log(result);
    //- },
    //- async: false
    //- });
    //- }
  }     
  $(this).html($(this).html() == 'Edit' ? 'Save' : 'Edit')
});
});