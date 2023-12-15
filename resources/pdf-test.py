from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def create_pdf_with_long_paragraph(file_name):
    # Create a canvas object that will be used to generate the PDF
    c = canvas.Canvas(file_name, pagesize=letter)

    # Set up the text for the PDF (long paragraph)
    text = """This is a rather long paragraph that will be placed in the PDF document. It contains several sentences and demonstrates how ReportLab handles line breaks at the end of words when the text reaches the end of the available space in the PDF. """

    # Set the font and size for the text
    c.setFont("Helvetica", 12)

    # Define the width and height for the text box
    width, height = letter

    # Set up the starting position for the text
    x, y = 50, height - 75

    # Define the text box height and line height
    text_box_height = 500  # Adjust as needed
    line_height = 14  # Adjust line spacing as needed

    x, y = add_lines(text, width, height, text_box_height, line_height, c, x, y)

    

    # Save the PDF file
    c.save()


def add_lines(text, width, height, text_box_height, line_height, c, x_start, y_start):
    # Split the long paragraph into manageable chunks to fit within the text box
    x, y = x_start ,y_start
    lines = text.split()
    chunks = []
    current_line = lines.pop(0)
    for word in lines:
        test_line = current_line + ' ' + word
        if c.stringWidth(test_line) < (width - 100) and c.stringWidth(test_line) < text_box_height:
            current_line = test_line
        else:
            chunks.append(current_line)
            current_line = word
    chunks.append(current_line)

    # Draw the text chunks on the canvas
    for chunk in chunks:
        c.drawString(x, y, chunk)
        y -= line_height
        if y < 50:  # New page if the text reaches the end of the page
            c.showPage()
            c.setFont("Helvetica", 12)
            y = height - 50
    
    return (x, y)

# Call the function to create the PDF
create_pdf_with_long_paragraph("example_long_paragraph.pdf")
