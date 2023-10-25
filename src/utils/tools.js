
// for a given range of numbers, get the next available number and the updated range
// i.e. if the range is 1-10, the next available number is 1 and the updated range is 2-10
export const getNextImsiAndRange = (imsiRange) => {
	const imsiRangeArray = imsiRange.split('-');
	const nextImsi = imsiRangeArray[0];
	const updatedRange = `${parseInt(imsiRangeArray[0]) + 1}-${imsiRangeArray[1]}`;
	return { nextImsi, updatedRange };
}