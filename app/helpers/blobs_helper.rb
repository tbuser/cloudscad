module BlobsHelper
  def blob_display(blob)
    case blob.mime_type 
    when "application/sla"
      "stl"
    when "text/plain"
      raw(format_code(blob.data))
    else
      "Binary Data"
    end    
  end
end