var dateFilter = function() {
  $('tbody[sheetid]').children('tr').each(function() {
    if (!$('#date').val().trim().length || $('#date').val().trim().length !== 4 || $(this).html().indexOf('>' + $('#date').val().trim() + '<') !== -1) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}
$('body').on('keyup', '#date', dateFilter);

var cancellations = function(opts) {
  if (opts === undefined) opts = {};
  if (opts.api === undefined) opts.api = 'https://api.cottagelabs.com/use/google/sheets/';

  $('.sheet').each(function() {
    var sid = $(this).attr('sheetid');
    var sheet = $(this).attr('sheet');
    if (sid) {
      $.ajax({
        url: opts.api + sid + (sheet ? '?sheet=' + sheet : ''),
        obj: $(this),
        success: function(data) {
          var tbl = '<table width=100%><thead> \
<th><b>Institution/<br />Consortium</b></th> \
<th><b>Date</b></th> \
<th><b>Region</b></th> \
<th><b>Publisher(s)</b></th> \
<th><b>Strategic Considerations</b></th> \
<th><b>Outcome</b></th> \
<th><b>Estimated Annual Savings (USD)</b></th>';
          tbl += '</thead><tbody sheetid=' + this.obj.attr('sheetid') + '>';
          for ( var r in data ) {
            tbl += '<tr>';
            var keys = ['institution', 'date', 'region', 'publisher', 'considerations', 'outcome', 'savings'];
            for ( var k in keys) {
              var dk = data[r][keys[k]];
              if (dk === undefined) { dk === ''; }
              if (keys[k] === 'institution' && data[r].href) dk = '<a href="' + data[r].href + '">' + dk + '</a>'
              tbl += '<td>' + dk + '</td>';
            }
            tbl += '</tr>';
          }
          tbl += '</tbody></table>';
          this.obj.append(tbl);
        }
      });
    }
  });
}
cancellations();
