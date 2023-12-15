from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph

def create_pdf_with_repeated_paragraph(file_name):
    # Create a canvas object that will be used to generate the PDF
    c = canvas.Canvas(file_name, pagesize=letter)

    # Define the text for the PDF (single paragraph)
    text = """This is a rather long paragraph that will be repeated in the PDF document. It contains several sentences and demonstrates how ReportLab handles line breaks at the end of words when the text reaches the end of the available space in the PDF. """

    # Define the font and size for the text
    font_name = "Helvetica"
    font_size = 12

    # Define the width and height for the text box
    width, height = letter

    # Set up the starting position for the text
    x, y = 50, height - 100

    # Create a ParagraphStyle for justified text
    styles = getSampleStyleSheet()
    justified_style = styles["BodyText"]
    justified_style.alignment = 4  # 4 represents 'Justify'

    # Create a Paragraph object with the text and the justified style
    p = Paragraph(text, justified_style)

    # Define the number of repetitions for the paragraph
    num_paragraphs = 20
    for _ in range(num_paragraphs):
        # Calculate the space left on the page
        space_left = y - 50  # 50 is the margin at the bottom of the page
        text_height = p.wrap(width - 100, space_left)[1]

        # Check if there's enough space for another paragraph
        if text_height > space_left:
            c.showPage()  # New page
            c.setFont(font_name, font_size)  # Restore font and size
            y = height - 100  # Reset y position

        p.drawOn(c, x, y)  # Draw the paragraph on the canvas
        y -= text_height + 10  # Adjust vertical position for the next paragraph

    # Save the PDF file
    c.save()

# Call the function to create the PDF
create_pdf_with_repeated_paragraph("example_repeated_paragraphs.pdf")



from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph

def create_pdf_with_multi_paragraphs(file_name, text):
    # Create a canvas object that will be used to generate the PDF
    c = canvas.Canvas(file_name, pagesize=letter)

    # Define the font and size for the text
    font_name = "Helvetica"
    font_size = 12

    # Define the width and height for the text box
    width, height = letter

    # Set up the starting position for the text
    x, y = 50, height - 50

    # Create a ParagraphStyle for justified text
    styles = getSampleStyleSheet()
    justified_style = styles["BodyText"]
    justified_style.alignment = 4  # 4 represents 'Justify'

    # Split the text into paragraphs based on newline characters
    paragraphs = text.split('\n')

    # Create a Paragraph object for each paragraph and handle page breaks
    for paragraph in paragraphs:
        # Skip empty paragraphs
        if not paragraph.strip():
            continue
        
        # Create a Paragraph object with the text and the justified style
        p = Paragraph(paragraph, justified_style)

        # Calculate the space left on the page
        space_left = y - 50  # 50 is the margin at the bottom of the page
        text_height = p.wrap(width - 100, space_left)[1]

        # Check if there's enough space for the current paragraph
        if text_height > space_left:
            c.showPage()  # New page
            c.setFont(font_name, font_size)  # Restore font and size
            y = height - 50  # Reset y position

        p.drawOn(c, x, y - text_height)  # Draw the paragraph on the canvas
        y -= text_height + 10  # Adjust vertical position for the next paragraph

    # Save the PDF file
    c.save()

# Example text with multiple paragraphs separated by \n
multi_paragraph_text = """This is the first paragraph. This is the first paragraph. This is the first paragraph. This is the first paragraph. This is the first paragraph. This is the first paragraph. This is the first paragraph. This is the first paragraph. This is the first paragraph. This is the first paragraph. This is the first paragraph. This is the first paragraph. This is the first paragraph. This is the first paragraph. This is the first paragraph. This is the first paragraph. 
This is the second paragraph.
And here's the third paragraph.
This is the fourth paragraph, and so on. This is the fourth paragraph, and so on. This is the fourth paragraph, and so on. This is the fourth paragraph, and so on. This is the fourth paragraph, and so on. This is the fourth paragraph, and so on. This is the fourth paragraph, and so on. This is the fourth paragraph, and so on. This is the fourth paragraph, and so on. This is the fourth paragraph, and so on. This is the fourth paragraph, and so on. 
"""

# Call the function to create the PDF with multi paragraphs
create_pdf_with_multi_paragraphs("example_multi_paragraphs.pdf", multi_paragraph_text)

