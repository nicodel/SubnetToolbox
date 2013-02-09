for (var i=0; i < 256; i=i+nodes){
	j=i+1;
	topi = (i+nodes-1) & 255;
	topj = topi-1;
	if (networks == 128){
		j = i;
		topi = (i+nodes-1) & 255;topj = topi;
		}
	SubnetWindow.document.write("<tr><td>"+f.oct1.value+"."+f.oct2.value+"."+f.oct3.value+"."+ i +"<\/td><td>"+f.oct1.value+"."+f.oct2.value+"."+f.oct3.value+"."+ j +"<\/td><td>"+f.oct1.value+"."+f.oct2.value+"."+f.oct3.value+"."+ topj + "<\/td><td>"+f.oct1.value+"."+f.oct2.value+"."+f.oct3.value+"."+topi+"<\/td><\/tr>");}

for (var i=0; i < 65536; i=i+nodes){
	count=count+1;
	i4 = i & 255;
	i3 = (i/256) & 255;
	j=i4+1;
	topi4 = ((i+nodes)-1) & 255;
	topi3 = (((i+nodes)-1)/256) & 255;
	topj = topi4-1;
	if (networks == 32768){
		j = i4;
		topi4 = (i+nodes-1) & 255;
		topj = topi4;}
	SubnetWindow.document.write("<tr><td>"+f.oct1.value+"."+f.oct2.value+"."+ i3 +"."+ i4 +"<\/td><td>"+f.oct1.value+"."+f.oct2.value+"."+ i3 +"."+ j +"<\/td><td>"+f.oct1.value+"."+f.oct2.value+"."+ topi3 +"."+ topj + "<\/td><td>"+f.oct1.value+"."+f.oct2.value+"."+ topi3 +"."+ topi4 +"<\/td><\/tr>");
	if ((count == 256) && (networks > 512)) {
		SubnetWindow.document.write("<tr><td>..<\/td><td>..<\/td><td>..<\/td><td>..<\/td><\/tr>");
		i=65536-(count*nodes);
		}
	}