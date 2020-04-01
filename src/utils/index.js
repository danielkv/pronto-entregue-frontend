
import numeral from 'numeral';

export const setPageTitle = (newTitle) => {
	if (newTitle)
		return document.title = `Pronto, Entregue! - ${newTitle}`;
	
	return document.title = `Pronto, Entregue!`;
}

numeral.register('locale', 'br', {
	delimiters: {
		thousands: '.',
		decimal: ','
	},
	abbreviations: {
		thousand: 'k',
		million: 'm',
		billion: 'b',
		trillion: 't'
	},
	currency: {
		symbol: 'R$ '
	}
});

numeral.locale('br');