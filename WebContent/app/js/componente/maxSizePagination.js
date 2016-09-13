function maxSizePagination(valueMax, itensSize) {
	var maxSize = 0;

	if(valueMax < (itensSize - 1 )){
		maxSize = 1;
	}
	else if((valueMax / itensSize ) > 0 <= 9){
		maxSize = Math.round(valueMax / itensSize) + 1;
		
		if(maxSize > 5){
			maxSize = 5;
		}
	}
	else if(valueMax > (itensSize * 5)){
		maxSize = 5;	
	}	
	else{
		maxSize = Math.round(valueMax / itensSize);
	}
	return maxSize;

};