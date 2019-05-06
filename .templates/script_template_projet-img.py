#!/usr/bin/python3

from collections import defaultdict

with open('in_template_projet-img.json', 'r') as f_in:
	data_in = f_in.read()

def nth(i):
	i_str = str(i)
	if i_str[-1] == '1' and i != 11:
		return f'{i}st'
	elif i_str[-1] == '2' and i != 12:
		return f'{i}nd'
	elif i_str[-1] == '3' and i != 13:
		return f'{i}rd'
	else:
		return f'{i}th'

image_list = ["amara", "gaige", "lilith", "maya", "tina", "moxxi", "moze", "angel"]
def image_value(i):
	return image_list[i % len(image_list)]

with open('out_template_projet-img.json', 'w') as file:
	for i in range(1, 11):
		file.write(eval('f' + repr(data_in), globals()))
		if i < 10:
			file.write(',')