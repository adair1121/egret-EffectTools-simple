class Item extends eui.ItemRenderer{
	public itemText:eui.Label;
	public removeBtn:eui.Label;
	public constructor() {
		super();
		this.skinName = "ItemSkin"
	}
	protected dataChanged():void{
		this.itemText.text = this.data.txt;
	}
}