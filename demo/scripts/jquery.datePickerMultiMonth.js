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
			var pickers = [];
			var basePicker;

			var m;
			
			if (s.inline) {

				$dpmm.html('');

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
				basePicker = pickers[0];
				
			} else {
				$dpmm.datePicker(dps).bind(
					'dateSelected',
					function(event, date, $td, status)
					{
						$dpmm.trigger('dateSelected', [date, $td, status]);
						pickers[1].dpSetSelected(date.asString(), status, false);
						return false;
					}
				).bind(
					'dpDisplayed',
					function(event, datePickerDiv)
					{
						pickers = [$dpmm];
						var $popup = $(datePickerDiv);
						var w = $popup.css('width');
						$popup.find('.dp-nav-next').css('display', 'none').end().wrapInner('<div class="dp-applied"><div class="dp-popup dp-popup-inline"></div></div>').css({width: 'auto'});

						var s = $.extend({}, dps);

						s.inline = true;
						s.month = m;

						for (var i=1; i<s.numMonths; i++) {
							var last = i == s.numMonths-1;
							(function(i) {
								var $dp = $('<div />');
								$popup.append($dp);
								s.month ++;
								$dp.datePicker(s).bind(
									'dpMonthChanged',
									function(event, displayedMonth, displayedYear)
									{
										pickers[i-1].dpSetDisplayedMonth(displayedMonth-1, displayedYear);
										if (!last)	{
											pickers[i+1].dpSetDisplayedMonth(displayedMonth+1, displayedYear);
										}
										return false;
									}
								).bind(
									'dateSelected',
									function(event, date, $td, status)
									{
									}
								).find('.dp-nav-next').css('display', last ? 'block' : 'none').end()
									.find('.dp-nav-prev').css('display', 'none').end();
								pickers.push($dp);
							})(i);
						}
					}
				).bind(
					'dpMonthChanged',
					function(event, displayedMonth, displayedYear)
					{
						m = displayedMonth;
						//$dpmm.trigger('dpMonthChanged', [displayedMonth, displayedYear]);
						if (pickers[1]) {
							pickers[1].dpSetDisplayedMonth(displayedMonth+1, displayedYear);
						}
						return false;
					}
				);
				basePicker = $dpmm;
			}

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