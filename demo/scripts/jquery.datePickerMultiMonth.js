/**
 * Copyright (c) 2008 Kelvin Luck (http://www.kelvinluck.com/)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 **/

(function($){
    
	$.fn.extend({
		datePickerMultiMonth : function(s)
		{
			s.numMonths = s.numMonths || 2;

			var dps = $.extend({}, $.fn.datePicker.defaults, s);

			$dpmm = $(this);
			
			if (s.inline) {

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
						$date.find('.dp-nav-prev').css('display', first ? 'block' : 'none');
						$date.find('.dp-nav-next').css('display', last ? 'block' : 'none');
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
			} else {
				$dpmm.data('dpBasePicker', $dpmm[0]);
				$dpmm.datePicker(dps).bind(
					'dateSelected',
					function(event, date, $td, status)
					{
					}
				).bind(
					'dpDisplayed',
					function(event, datePickerDiv)
					{
						var $popup = $(datePickerDiv);
						var w = $popup.css('width');
						$popup.find('.dp-nav-next').css('display', 'none').end().wrapInner('<div class="dp-applied"><div class="dp-popup dp-popup-inline"></div></div>').css({width: 'auto'});

						dps.inline = true;

						for (var i=1; i<s.numMonths; i++) {
							var $dp = $('<div />');
							$popup.append($dp);
							$dp.datePicker(dps).find('.dp-nav-next').css('display', i == s.numMonths-1 ? 'block' : 'none').end()
								.find('.dp-nav-prev').css('display', 'none').end();
						}
					}
				).bind(
					'dpMonthChanged',
					function(event, displayedMonth, displayedYear)
					{
					}
				);
			}
			
			return this;
		},
		dpmmGetSelected : function()
		{
			var basePicker = $(this).data('dpBasePicker');
			return basePicker.dpGetSelected();
		}
	});
	
})(jQuery);