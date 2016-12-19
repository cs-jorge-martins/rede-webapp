/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

function MaxSizePagination(intValueMax, intItensSize) {
	var intMaxSize = 0;

	if(intValueMax < (intItensSize - 1 )){
		intMaxSize = 1;
	}
	else if((intValueMax / intItensSize ) > 0 <= 9){
		intMaxSize = Math.round(intValueMax / intItensSize) + 1;

		if(intMaxSize > 5){
			intMaxSize = 5;
		}
	}
	else if(intValueMax > (intItensSize * 5)){
		intMaxSize = 5;
	}
	else{
		intMaxSize = Math.round(intValueMax / intItensSize);
	}
	return intMaxSize;

};
