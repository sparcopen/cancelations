cancellations = {};

cancellations.REFERRER = "https://bigdeal.sparcopen.org"
cancellations.KEYS = ['institution', 'date', 'country', 'publisher', 'considerations', 'outcome', 'savings'];
cancellations.KEYMAP = {}
cancellations.DATA = {}

cancellations.init = function() {
  cancellations.getData({
    callback: cancellations.renderData
  });
  $('#date').on('keyup', cancellations.dateFilter);
}

cancellations.getData = function(params) {
  let container = $("#sheet");
  let sid = container.attr("data-sheetid");
  let tid = container.attr("data-tab");
  let key = container.attr("data-key");

  let url = `https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/${tid}?key=${key}`;
  $.ajax({
    url: url,
    headers: {"referrer": cancellations.REFERRER},
    dataType: "jsonp",
    success: function (data) {
      let keys = data.values.shift();
      for (let k of cancellations.KEYS) {
        let i = keys.indexOf(k);
        cancellations.KEYMAP[k] = i;
      }

      cancellations.DATA = data.values;
      params.callback();
    }
  });
}

cancellations.renderData = function() {
  let tbl = `<table style="width:100%"><thead>
      <th><b>Institution/<br />Consortium</b></th>
      <th><b>Date</b></th>
      <th><b>Country</b></th>
      <th><b>Publisher(s)</b></th>
      <th><b>Strategic Considerations</b></th>
      <th><b>Outcome</b></th>
      <th><b>Estimated Annual Savings (USD)</b></th>
    </thead>
    <tbody>`;

  for ( let r of cancellations.DATA ) {
    tbl += '<tr>';
    for ( let k of cancellations.KEYS) {
      let dk = r[cancellations.KEYMAP[k]];
      if (dk === undefined) { dk === ''; }
      if (k === 'institution' && r.source) {
        dk = `<a href="${r.source}">${dk}</a>`
      }
      tbl += `<td>${dk}</td>`;
    }
    tbl += '</tr>';
  }
  tbl += '</tbody></table>';
  $("#sheet").html(tbl);
}

cancellations.dateFilter = function() {
  $('#sheet tbody').children('tr').each(function() {
    let date = $("#date").val().trim();
    if (!date.length || date.length !== 4 || $(this).html().indexOf('>' + date + '<') !== -1) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}

cancellations.init();