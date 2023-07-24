$(document).ready(function () {
  $("#inputDate").val("");
  $("#datepicker").datepicker({
    onSelect: function (dateText) {
      var date = $(this).datepicker("getDate");
      var dayOfYear = ("00" + date.getDOY()).slice(-3);
      var formattedDate = $.datepicker.formatDate("mm/dd/yy", date);
      $("#juliandate").text(dayOfYear);
      $("#gregoriandate").text(formattedDate);
    },
  });

  Date.prototype.getDOY = function () {
    var start = new Date(this.getFullYear(), 0, 0);
    var diff =
      this -
      start +
      (start.getTimezoneOffset() - this.getTimezoneOffset()) * 60 * 1000;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day;
  };

  // Display the Julian day and formatted date of the year immediately when the page loads
  var date = new Date();
  var dayOfYear = ("00" + date.getDOY()).slice(-3);
  var formattedDate = $.datepicker.formatDate("mm/dd/yy", date);
  $("#juliandate").text(dayOfYear);
  $("#gregoriandate").text(formattedDate);

  // Initialize tooltips
  $("#juliandate").tooltip({ trigger: "hover" });
  $("#gregoriandate").tooltip({ trigger: "hover" });

  // Function to handle copying to clipboard and showing tooltips
  function handleCopyAndTooltip(elementId) {
    $(elementId).click(function () {
      var copyText = $(this).text();
      navigator.clipboard.writeText(copyText).then(
        function () {
          // Change tooltip text and show it
          $(elementId).attr("data-original-title", "Copied!").tooltip("show");
          // Change tooltip text back and hide it after 2 seconds
          setTimeout(function () {
            $(elementId)
              .attr("data-original-title", "Copy to clipboard")
              .tooltip("hide");
          }, 2000);
        },
        function (err) {
          console.log("Error in copying text: " + err);
        }
      );
    });
  }

  handleCopyAndTooltip("#juliandate");
  handleCopyAndTooltip("#gregoriandate");

  // Set the datepicker to the date or Julian day entered in the input field when the Enter key is released or when the input field loses focus
  $("#inputDate").on("keyup", function (event) {
    var inputVal = $(this).val();

    if (
      event.which === 13 ||
      /^\d{3}$/.test(inputVal) ||
      /\d{2}\/\d{2}\/\d{4}/.test(inputVal)
    ) {
      // If the Enter key was released, or if the input is a Julian day or a date
      if (/^\d{1,3}$/.test(inputVal)) {
        // If the input is a Julian day (a number from 1 to 365)
        var newDate = new Date(date.getFullYear(), 0); // Start at the beginning of the year
        newDate.setDate(inputVal); // Add the Julian day to the date
        $("#datepicker").datepicker("setDate", newDate);
        var newDayOfYear = ("00" + newDate.getDOY()).slice(-3);
        var newFormattedDate = $.datepicker.formatDate("mm/dd/yy", newDate);
        $("#juliandate").text(newDayOfYear);
        $("#gregoriandate").text(newFormattedDate);
      } else if (/\d{2}\/\d{2}\/\d{4}/.test(inputVal)) {
        // If the input is a date in MM/DD/YYYY format
        var newDate = new Date(inputVal);
        $("#datepicker").datepicker("setDate", newDate);
        var newDayOfYear = ("00" + newDate.getDOY()).slice(-3);
        var newFormattedDate = $.datepicker.formatDate("mm/dd/yy", newDate);
        $("#juliandate").text(newDayOfYear);
        $("#gregoriandate").text(newFormattedDate);
      }
    }
  });
});
