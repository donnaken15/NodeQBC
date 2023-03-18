// ---------------------------------------------------
//
//	QBKEY
//	CRC32 checksum
//
// ---------------------------------------------------

const ItemCore = require('./Core.js');

class QBCQBKey extends ItemCore
{
	Initialize() { this.value = 0; }
	
	Read() 
	{ 
		if (this.InScript())
			this.ReadSharedValue();
		else
			this.ReadSharedProperties(); 
	}
	
	IsSingleLine() { return true; }
	ReadSharedValue() { 
        this.value = QBC.constants.Keys.FromKey("0x" + this.reader.UInt32().toString(16).padStart(8, "0"));
    }
    
	GetDebugText() { return ": " + this.value; }
	GetItemInfoType() { return QBC.constants.TypeBindings['QBKey']; }
	
	//-----------------------
	// Outputs actual text
	//-----------------------
	
	WriteText()
	{
		this.WriteIDString();
		
		// Is this preceded by a local argument?
		var isArg = false;
		
		var preceding = this.PreviousChild();
		if (preceding && preceding.GetValueText() == "argument")
			isArg = true;
		
		var valstr = this.GetValueText( QBC.KeyToString(this.value.toString()) );
        
		this.job.AddText(isArg ? ("<" + valstr + ">") : valstr);
		
		if (this.CanAutoCreateNewlines())
			this.job.AddLine();
		else
			this.AddInlineSpace();
	}
	
	//--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
	//
	//	S E R I A L I Z E
	//		Converts JS data to QB bytecode
	//
	//--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
	
	//-----------------------
	// Writes the object's data
	//-----------------------
	
	SerializeSharedData()
	{
		if (this.InScriptBody())
			this.writer.UInt8(QBC.constants.ESCRIPTTOKEN_NAME);
			
		var valKey = QBC.constants.Keys.ToKey(this.value);
		
		this.writer.UInt32(valKey);		// QBKey value
	}
}

module.exports = QBCQBKey;
