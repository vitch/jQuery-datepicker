/**
 * Copyright (c) 2008 Kelvin Luck (http://www.kelvinluck.com/)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 **/

(function($){
    
	$.fn.extend({
		datePickerMultiMonth : function(s)
		{
			if (!s.inline) {
				throw new Error('Not yet implemented for popup calendars :(');
			}
			if (s.numMonths == undefined) {
				throw new Error('Must set numMonths to call datePickerMultiMonth!');
			}

			var dps = $.extend({}, $.fn.datePicker.defaults, s);
			
			$dpmm = $(this);

			$dpmm.html('');

			var pickers = [];
			for (var i=0; i<s.numMonths; i++)
			{
				(function(i) {
					var first = i == 0;
					var last = i == s.numMonths - 1;
					var $date =  $('<div />')
									.datePicker(dps)
									.bind('dpMonthChanged',
										function(event, displayedMonth, displayedYear)
										{
											if (first) {
												$dpmm.trigger('dpMonthChanged', [displayedMonth, displayedYear]);
											} else {
												pickers[i-1].dpSetDisplayedMonth(displayedMonth-1, displayedYear);
											}
											if (!last)	{
												pickers[i+1].dpSetDisplayedMonth(displayedMonth+1, displayedYear);
											}
											return false;
										}
									)
									.bind(
										'dateSelected',
										function(event, date, $td, status)
										{
											if (first)	{
												$dpmm.trigger('dateSelected', [date, $td, status]);
											} else {
												pickers[i-1].dpSetSelected(date.asString(), status, false);
											}
											if (!last)	{
												pickers[i+1].dpSetSelected(date.asString(), status, false);
											}
											return false;
										}
									);
					$('.dp-nav-prev', $date).css('display', first ? 'block' : 'none');
					$('.dp-nav-next', $date).css('display', last ? 'block' : 'none');
					pickers.push($date);
					$dpmm.append($date);
				})(i);
			}
			
			var basePicker = pickers[0];
			$dpmm.data('dpBasePicker', basePicker);

			// dodgy hack so that I can set the month to the correct value and trigger a redraw of the other elements... 
			basePicker.dpSetDisplayedMonth(1, 3000);
			// set the month to the correct value so the other date pickers get set to the correct months...
			basePicker.dpSetDisplayedMonth(Number(s.month), Number(s.year));
			
			return this;
		},
		dpmmGetSelected : function()
		{
			var basePicker = $(this).data('dpBasePicker');
			return basePicker.dpGetSelected();
		}
	});
	
})(jQuery);