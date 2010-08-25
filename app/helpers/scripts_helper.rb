module ScriptsHelper
  def format_code(code)
    CodeRay.scan(code, :c).div(:line_numbers => :inline)
  end
end
