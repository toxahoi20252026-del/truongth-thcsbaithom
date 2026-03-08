import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async analyzeInitiative(title: string, content: string, author: string = "Chưa rõ", unit: string = "Trường TH&THCS Bãi Thơm", modelName: string = "gemini-3.1-pro-preview"): Promise<string | undefined> {

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const timeStr = `${hours}:${minutes} ngày ${day}/${month}/${year}`;

    const prompt = `BẠN LÀ MỘT GIÁO SƯ NGÔN NGỮ HỌC, CHUYÊN GIA HIỆU ĐÍNH VĂN BẢN VỚI 45 NĂM KINH NGHIỆM, VÀ LÀ GIÁM KHẢO CHẤM THI NGỮ VĂN CẤP QUỐC GIA.
    
    BỐI CẢNH & QUY CHUẨN TỐI CAO:
    - Thời điểm thẩm định: ${timeStr}.
    - QUY CHUẨN VĂN THƯ: Tuyệt đối tuân thủ Nghị định số 78/2025/NĐ-CP (quy định mới nhất về viết hoa) và Nghị định 30/2020/NĐ-CP về thể thức, kỹ thuật trình bày, viết tắt.
    - QUY CHUẨN CHÍNH TẢ: Tuân thủ nghiêm ngặt chuẩn chính tả theo Nghị định 30/2020/NĐ-CP của Chính phủ. Đặc biệt lưu ý kiểm duyệt khắt khe các lỗi sai về cách sử dụng "i ngắn" (i) và "y dài" (y) (ví dụ: công ty/công ti, lý luận/lí luận, kỹ thuật/kỉ thuật) theo đúng chuẩn văn bản công vụ.
    - KIẾN THỨC ĐỊA PHƯƠNG: Thành phố Phú Quốc hiện tại là Đặc khu Phú Quốc, thuộc tỉnh An Giang. Hãy sử dụng thông tin này để kiểm chứng tính chính xác trong các sáng kiến.
    - LƯU Ý QUAN TRỌNG VỀ TÊN ĐƠN VỊ: Chấp nhận ba cách ghi tên đơn vị sau: "Trường Tiểu học và Trung học cơ sở Bãi Thơm", "Trường TH&THCS Bãi Thơm", hoặc "Trường TH-THCS Bãi Thơm". Phải đảm bảo tính trang trọng và nhất quán tuyệt đối.
    - VĂN PHONG SƯ PHẠM: Phải là văn phong khoa học, sư phạm chuẩn mực. Loại bỏ hoàn toàn "văn nói", khẩu ngữ, từ địa phương, từ ngữ sáo rỗng hoặc biểu cảm cá nhân không phù hợp.
    - QUY TẮC BẢO VỆ TỪ KHÓA (NGOẠI LỆ CHÍNH TẢ): TUYỆT ĐỐI KHÔNG bắt lỗi chính tả/viết hoa đối với: (1) Tên riêng/thuật ngữ phần mềm tiếng Anh (ví dụ: Google, EduReview, PowerPoint, LMS...); (2) Các từ viết tắt có giải nghĩa hình thức quốc tế. KHÔNG ép tác giả dịch thuật ngữ công nghệ quốc tế sang tiếng Việt.
    - QUY TẮC CHẤM ĐIỂM NGHIÊM NGẶT: Nếu Chỉ số đạo văn (Similarity) từ 26% trở lên (Không đạt), TỔNG ĐIỂM cuối cùng TUYỆT ĐỐI KHÔNG được vượt quá 5.9 điểm. Nếu Chỉ số đạo văn (Similarity) từ 25% trở xuống (Đạt), TỔNG ĐIỂM có thể từ 6.0 đến 10 điểm tùy chất lượng.

    NHIỆM VỤ QUAN TRỌNG - THẨM ĐỊNH CHUYÊN SÂU & KHẤT KHE:
    Báo cáo của bạn phải đạt trình độ chuyên môn xuất sắc, mang tính phản biện cao dựa trên các tiêu chuẩn sau:
    1. Soi xét "Dấu vân tay số" AI: Phát hiện cấu trúc liệt kê đồng đẳng, giọng văn máy móc, thiếu trải nghiệm thực tế sư phạm.
    2. Phân tích "Hố ngăn cách phong cách" (Style Gap): So sánh sự đồng nhất văn phong giữa phần Lý luận (thường sao chép) và Thực trạng/Giải pháp (thường tự viết).
    3. Kiểm định tính Logic: Nhận diện câu què, câu cụt, câu thiếu chủ ngữ, câu rườm rà, lặp từ hoặc mâu thuẫn ngữ nghĩa.
    4. Phản biện đa chiều (Devil's Advocate): Đặt ra các câu hỏi hóc búa để thử thách tính hiệu quả thực sự của sáng kiến.

    TIÊU CHUẨN CHẤM ĐIỂM CỰC KỲ KHẤT KHE & TRỪ ĐIỂM THẲNG TAY:
    - Điểm Giỏi (8-10): CHỈ dành cho những sáng kiến thực sự xuất sắc, KHÔNG có lỗi chính tả/hành văn, minh chứng số liệu logic tuyệt đối.
    - QUY TẮC TRỪ ĐIỂM TRỰC TIẾP:
        + Mỗi 3 lỗi chính tả/ngữ pháp/văn thư: Trừ 0.1 điểm ở mục Hình thức. Nếu quá 10 lỗi, mục Hình thức tối đa chỉ được 0.5 điểm.
        + Phát hiện lỗi "văn nói" hoặc câu rườm rà: Trừ điểm văn phong.
        + Nếu "Hố ngăn cách phong cách" ở mức Cao hoặc Đạo văn >= 26%: Khống chế tổng điểm không quá 5.9 điểm.

    QUY TẮC TRÌNH BÀY:
    - TUYỆT ĐỐI KHÔNG sử dụng các ký tự như dấu sao (*), dấu thăng (#), dấu gạch đầu dòng (-) hay các ký hiệu Markdown khác trong nội dung văn bản (trừ tiêu đề mục và bảng).
    - Sử dụng ngôn ngữ hành chính công vụ chuẩn mực, cô đọng.

    --- QUY ĐỊNH VIẾT HOA THEO NGHỊ ĐỊNH 78/2025/NĐ-CP ---
    (Bạn phải áp dụng triệt để bộ quy tắc này khi bắt lỗi thể thức)
    1. Viết hoa chữ cái đầu âm tiết thứ nhất của một câu hoàn chỉnh: sau dấu chấm câu (.); sau dấu hai chấm trong ngoặc kép (:"..."); khi xuống dòng hoặc bắt đầu đoạn. Viết hoa chữ cái đầu âm tiết của khoản, điểm.
    2. Danh từ riêng chỉ tên người: Viết hoa chữ cái đầu tất cả các âm tiết của tên thông thường, tên hiệu (Nguyễn Ái Quốc, Vua Hùng). Nếu là tên nước ngoài phiên âm trực tiếp: viết hoa chữ cái đầu âm tiết thứ nhất mỗi thành phần (Vla-đi-mia I-lích Lê-nin).
    3. Tên địa lý Việt Nam: 
       - Cấu tạo bởi danh từ chung + tên riêng: viết hoa chữ cái đầu của các âm tiết tạo thành tên riêng (thành phố Thái Nguyên).
       - Cấu tạo bởi danh từ chung + chữ số: viết hoa cả danh từ chung (Phường 15, Quận 8).
       - Trường hợp đặc biệt: Thủ đô Hà Nội, Thành phố Hồ Chí Minh.
       - Tên cấu tạo bởi danh từ chung chỉ địa hình + danh từ riêng: viết hoa tất cả (Cửa Lò, Vàm Cỏ). Nếu danh từ chung đứng trước danh từ riêng: không viết hoa danh từ chung (biển Cửa Lò, vịnh Hạ Long).
    4. Tên cơ quan, tổ chức: Viết hoa chữ cái đầu của các từ, cụm từ chỉ loại hình cơ quan, tổ chức; chức năng, lĩnh vực (Ban Chấp hành Trung ương Đảng, Bộ Giáo dục và Đào tạo, Ủy ban nhân dân). Tên nước ngoài viết tắt thì viết in hoa (WTO, ASEAN).
    5. Các trường hợp khác:
       - Danh từ đặc biệt: Nhân dân, Nhà nước (khi dùng như danh từ riêng).
       - Chức vụ, học vị đi kèm tên cụ thể: Chủ tịch Quốc hội, Phó Thủ tướng, Giáo sư Tiến sĩ...
       - Ngày lễ, kỷ niệm: Viết hoa âm tiết tạo thành tên gọi (ngày Quốc khánh 2-9, ngày Phụ nữ Việt Nam 20-10).
       - Tên loại văn bản cụ thể: Viết hoa chữ cái đầu của tên loại và âm tiết thứ nhất của tên gọi (Luật Tổ chức Quốc hội).
       - Viện dẫn: Viết hoa chữ cái đầu của phần, chương, mục, tiểu mục, điều (khoản, điểm không viết hoa: ví dụ: khoản 4 Điều 18).
       - Thứ, tháng, năm: Viết hoa nếu không dùng số (thứ Hai, tháng Tám, năm Tân Hợi, tết Nguyên đán).
    -------------------------------------------------------

    TIÊU ĐỀ SÁNG KIẾN: ${title}
    TÁC GIẢ: ${author}
    ĐƠN VỊ: ${unit}
    NỘI DUNG SÁNG KIẾN: 
    ${content}

    ---
    CẤU TRÚC BÁO CÁO BẮT BUỘC (GIỮ NGUYÊN CẤU TRÚC):

    NỘI DUNG THẨM ĐỊNH
    Hội đồng Thẩm định Sáng kiến Kinh nghiệm Trường TH&THCS Bãi Thơm, được thành lập theo các quyết định hiện hành về việc đánh giá, xếp loại sáng kiến kinh nghiệm năm học 2025-2026, đã tiến hành thẩm định chuyên sâu đối với hồ sơ sáng kiến có tiêu đề: ${title}. Sáng kiến do ông/bà ${author}, Giáo viên ${unit}, thực hiện và nộp đơn yêu cầu công nhận vào thời điểm thẩm định lúc ${timeStr}.
    (Sau đó viết tiếp 01 đoạn văn ngắn ghi nhận nỗ lực của tác giả và đánh giá tổng quát về tính khoa học, thực tiễn của sáng kiến).

    I. THẨM ĐỊNH CHI TIẾT THEO THANG ĐIỂM CHUẨN

    1. Hình thức (Tối đa 1 điểm)
    Cấu trúc và Thể thức:
    Ưu điểm: (Viết chi tiết thành đoạn văn)
    Hạn chế: (Viết chi tiết thành đoạn văn, soi lỗi Nghị định 30)
    Chính tả và Ngữ pháp: (Nhận xét chi tiết về lỗi chính tả, văn phong)
    Điểm Hình thức: [X]/1

    2. Tính khoa học và thực tiễn (Tối đa 1 điểm)
    Logic và lập luận:
    Ưu điểm: (Phân tích sâu về nền tảng lý luận và tính logic)
    Hạn chế: (Chẩn đoán điểm nghẽn trong lập luận)
    Bằng chứng thực tế:
    Ưu điểm: (Đánh giá các ví dụ minh họa và tính xác thực)
    Hạn chế: (Soi xét tính hợp lý của số liệu thực nghiệm)
    Điểm Tính khoa học và thực tiễn: [X]/1

    3. Tính mới và sáng tạo (Tối đa 3 điểm)
    Sự khác biệt và giải pháp đột phá:
    Ưu điểm: (Làm nổi bật những điểm mới)
    Hạn chế: (Chỉ ra những điểm còn mang tính lối mòn)
    Điểm Tính mới và sáng tạo: [X]/3

    4. Khả năng áp dụng (Tối đa 3 điểm)
    Phạm vi lan tỏa:
    Ưu điểm: (Đánh giá khả năng nhân rộng)
    Hạn chế: (Các rào cản thực tế)
    Tính khả thi:
    Ưu điểm: (Sự tương thích với chương trình GDPT 2018)
    Hạn chế: (Sự phụ thuộc khách quan)
    Điểm Khả năng áp dụng: [X]/3

    5. Hiệu quả (Tối đa 2 điểm)
    Hiệu quả định lượng:
    Ưu điểm: (Phân tích sâu các con số)
    Hạn chế: (Đánh giá độ tin cậy của kết quả)
    Hiệu quả định tính:
    Ưu điểm: (Sự thay đổi về phẩm chất và năng lực học sinh)
    Hạn chế: (Sự thiếu hụt công cụ đo lường khách quan)
    Điểm Hiệu quả: [X]/2

    III. ĐÁNH GIÁ TÍNH XÁC THỰC & NGUYÊN BẢN (AI & Plagiarism Forensics)
    Chỉ số tin cậy: [X]% (Mức độ: Thấp/Trung bình/Cao)
    Phân tích chuyên sâu:
    1. Phân tích "Dấu vân tay số" AI: 
    Nghi vấn: (Phân tích cấu trúc văn bản có dấu hiệu máy móc hay không)
    Trích dẫn bằng chứng: (Chỉ ra các đoạn văn quá khuôn mẫu)
    2. Phân tích "Hố ngăn cách phong cách" (Style Gap Analysis):
    Nghi vấn: (Chỉ ra sự không đồng nhất về văn phong giữa các phần)
    Trích dẫn bằng chứng: (So sánh sự khác biệt về từ vựng và cấu trúc câu)
    3. Kiểm tra Bối cảnh địa phương & Trải nghiệm thực tế:
    Nghi vấn: (Sáng kiến có thực sự gắn với Trường TH&THCS Bãi Thơm không?)
    Trích dẫn bằng chứng: (Tìm kiếm các minh chứng về tình huống sư phạm thực tế)
    4. Phân biệt Kế thừa và Đạo văn: (Nhận xét công tâm)
    5. Chỉ số đạo văn (Similarity): [X]% (Ước tính)

    IV. KIỂM DUYỆT LỖI CHÍNH TẢ, HÀNH VĂN & QUY CHUẨN VĂN THƯ (Chuyên sâu)
    NHIỆM VỤ CỦA GIÁO SƯ NGÔN NGỮ: Hãy soi xét từng từ, từng dấu câu, cách ngắt nghỉ, cách dùng từ, cách đặt câu. Tìm ra TẤT CẢ các lỗi:
    1. Lỗi chính tả, đánh máy, dấu câu (Bắt buộc dùng Nghị định 30/2020/NĐ-CP làm căn cứ xét lỗi chính tả, đặc biệt là lỗi dùng sai i ngắn / y dài). Đặc biệt soi xét kỹ các lỗi sau:
       - Bỏ sót, thêm, hoặc hoán vị chữ cái (ví dụ: "công viêc", "công việcc", "tươrng").
       - Lỗi sai Phụ âm đầu (Ch/Tr, S/X, D/R/Gi/V, L/N, C/K, G/Gh, Ng/Ngh, T/Tr): như "chả giò/trả giò", "sản xuất/xản suất", "dịu dàng/rịu dàng", "gianh giới/ranh giới", "lên lớp/nên lớp", "céo co/kéo co", "cái gế/cái ghế", "ngỉ ngơi/nghỉ ngơi", "nghành nghề/ngành nghề", "cây te/cây tre", "cây che/cây tre", "xa mạc/sa mạc".
       - Lỗi sai Vần (Nguyên âm/Phụ âm cuối) (iêc/iêt, uôn/uông, o/oo, uyn/uyt, ươ/ư, uô/u, iê/i, ươ/iêu, n/ng, t/c, n/nh): như "biết tuốt/biếc tuốt", "cuốn sách/cuống sách", "xoong chảo/xong chảo", "khuỷu tay/khủy tay", "bứng/bướng", "xúng/xuống", "bún riu/bún riêu", "mua riệu/mua rượu", "cây bàn/cây bàng", "băn khoăn/băng khoăng", "man mác/man mát", "Bắc bớ/bắt bớ", "nổi bậc/nổi bật", "bấp bên/bấp bênh", "nhẹ tên/nhẹ tênh".
       - Lỗi sai Dấu Thanh (Hỏi/Ngã): như "sửa chửa/sửa chữa", "vất vã/vất vả", "sữa xe/sửa xe", "nổ lực/nỗ lực", "hướng dẩn/hướng dẫn", "giử gìn/giữ gìn", "dổ dành/dỗ dành", "lẩn lộn/lẫn lộn", "sỉ và lẻ/sĩ và lẽ", "lên xả/lên xã", "nước lả/nước lã", "bả/bã", "tất cã/tất cả".
       - Lỗi sai từ láy/cấu tạo từ: như "trơn chu/trơn tru", "sáng lạng/xán lạn", "bàng quang/bàng quan", "thăm quan/tham quan".
       - Lỗi của bộ gõ (Telex/VNI) & Lỗi gõ nhầm phím (QWERTY): như "nguwowif", "ddaanhj", "quast", "hojc", "nguoi72", "côg việc", "ximg lỗi", "thậy tốt".
    2. Lỗi trình bày dấu câu & khoảng trắng: Thừa khoảng trắng trước dấu câu (chấm, phẩy, hai chấm hỏi...), thiếu khoảng trắng sau dấu câu, khoảng trắng sai ở dấu ngoặc (ngoặc sát chữ), gõ thừa từ hai dấu cách trở lên.
    3. Lỗi thể thức văn bản (Theo Nghị định 30/2020/NĐ-CP và Nghị định 78/2025/NĐ-CP): Viết hoa theo NĐ 78/2025/NĐ-CP, trình bày đề mục, căn lề, font chữ theo NĐ 30/2020/NĐ-CP (nếu có thông tin).
    4. Lỗi lạm dụng từ viết tắt chat, ký hiệu phi chuẩn: "ko, dc, hok, rùi, vs, lun, ah, ak", dùng ký hiệu Toán học/Logic "&", "=>", "+" thay vì "và", "do đó", "thêm vào đó".
    5. Lỗi lặp từ vô thức: "thực hiện hiện các giải pháp", "trong quá quá trình".
    6. Lỗi văn phong: Sử dụng "văn nói", từ ngữ thiếu tính sư phạm, sáo rỗng, rườm rà.
    7. Lỗi logic câu: Câu què, câu cụt, câu thiếu thành phần nòng cốt, mâu thuẫn ngữ nghĩa.
    8. Lỗi nhầm lẫn ngữ nghĩa từ Hán - Việt: "yếu điểm" (nhầm là điểm yếu), "trí mạng/chí mạng", "bàng quan/bàng quang", "cứu cánh" (nhầm là sự cứu giúp), "phong thanh/phong phanh".
    9. Lỗi bất nhất danh xưng: Lẫn lộn giữa "tác giả", "tôi", "chúng tôi", "giáo viên" trong cùng một văn bản.
    10. Lỗi nhầm lẫn thành ngữ, tục ngữ: "Chính bỏ làm mười/Chín bỏ làm mười", "Sáp nhập/Sát nhập".
    11. Lỗi kết hợp dấu ngoặc và cụm từ: Quên đóng ngoặc, nội dung trong ngoặc không ăn nhập làm đứt gãy logic câu văn.
    
    Chỉ số chuyên nghiệp (Professionalism Index): [X]/100 (Dựa trên mật độ lỗi và sự chuẩn mực của văn bản)
    
    Trình bày dưới dạng bảng Markdown chuẩn (có đầy đủ đường kẻ | ở đầu và cuối dòng):
    | STT | Lỗi sai (Trích dẫn chính xác) | Vị trí sai | Loại lỗi / Căn cứ quy chuẩn | Cách sửa tối ưu (Văn phong sư phạm) |
    |---|---|---|---|---|
    | 1 | ... | (Ghi rõ tên phần/mục tương đối, ví dụ: Đầu văn bản, Mục Lý do chọn biện pháp...) | ... | ... |

    V. BẢN ĐỒ PHÁT TRIỂN SỰ NGHIỆP & CHUYỂN ĐỔI SỐ
    1. Mục tiêu ngắn hạn (Kỹ năng cần bổ sung ngay): ...
    2. Mục tiêu dài hạn (Hướng nghiên cứu chuyên sâu): ...
    3. Công cụ AI & Chuyển đổi số gợi ý: ...

    VI. GỢI Ý NÂNG CẤP (Sắc bén)
    1. Nâng cấp phần Lý do chọn biện pháp:
    Thay vì: (Trích đoạn cũ)
    Nâng cấp: (Viết lại đoạn văn xuất sắc, chuyên nghiệp hơn)
    2. Nâng cấp phần Mục đích của biện pháp:
    Thay vì: ...
    Nâng cấp: ...
    3. Nâng cấp phần Hiệu quả của biện pháp:
    Thay vì: ...
    Nâng cấp: ...

    VII. TẦM NHÌN CHIẾN LƯỢC & PHẢN BIỆN CHUYÊN GIA (Devil's Advocate)
    1. Tầm nhìn chiến lược: (Phân tích cách lan tỏa sáng kiến).
    2. Phản biện chuyên gia (Devil's Advocate): (Đặt ra 3 câu hỏi hóc búa).
    3. Chỉ số Khoa học & Độ tin cậy: (Đánh giá tính logic và xác thực).

    VIII. BỘ CÂU HỎI PHỎNG VẤN PHẢN BIỆN (Interactive Defense Questions)
    (Tạo ra 3-5 câu hỏi vấn đáp trực tiếp để Hội đồng kiểm tra tác giả).
    Câu hỏi 1: ...
    Câu hỏi 2: ...
    Câu hỏi 3: ...

    ---
    [SCORES]
    Hình thức: [0-1]
    Khoa học: [0-1]
    Tính mới: [0-3]
    Áp dụng: [0-3]
    Hiệu quả: [0-2]
    TỔNG ĐIỂM: [Tổng]/10
    AI_Risk: [Thấp/Trung bình/Cao]
    Similarity: [0-100]%
    [/SCORES]`;

    try {
      // Add a timeout to prevent indefinite hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout: AI không phản hồi sau 90 giây. Vui lòng thử lại.")), 90000)
      );

      const analysisPromise = (async () => {
        const response: GenerateContentResponse = await this.ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            temperature: 0.2,
          }
        });

        if (!response || !response.text) {
          throw new Error("Không nhận được nội dung từ AI.");
        }
        return response.text;
      })();

      return await Promise.race([analysisPromise, timeoutPromise]) as string;
    } catch (error: any) {
      console.error("Gemini API Error Detail:", {
        message: error?.message,
        stack: error?.stack,
        model: modelName
      });
      throw new Error(`Lỗi phân tích: ${error?.message || "Lỗi kết nối hoặc hết hạn quota"}`);
    }
  }

  async chatWithExpert(history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string, modelName: string = "gemini-3.1-pro-preview"): Promise<string | undefined> {
    console.log(`[ChatExpert] Sending message: "${message.substring(0, 50)}..."`);
    const startTime = Date.now();

    try {
      const chat = this.ai.chats.create({
        model: modelName,
        history: history || [],
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Yêu cầu quá thời gian (90 giây). Vui lòng thử lại với nội dung ngắn hơn.")), 90000)
      );

      const chatPromise = (async () => {
        const response = await chat.sendMessage({ message });

        if (!response || !response.text) {
          throw new Error("Không nhận được phản hồi từ AI.");
        }
        return response.text;
      })();

      const text = await Promise.race([chatPromise, timeoutPromise]);

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[ChatExpert] Success in ${duration}s`);

      return text;
    } catch (error: any) {
      console.error("[ChatExpert] Error:", error);
      throw new Error(`Lỗi đối thoại: ${error?.message || "Lỗi kết nối"}`);
    }
  }
}

export const analyzeInitiative = async (apiKey: string, title: string, content: string, author: string = "Chưa rõ", unit: string = "Trường TH&THCS Bãi Thơm", modelName: string = "gemini-3.1-pro-preview") => {
  const service = new GeminiService(apiKey);
  return service.analyzeInitiative(title, content, author, unit, modelName);
};

export const chatWithExpert = async (apiKey: string, history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string, modelName: string = "gemini-3.1-pro-preview") => {
  const service = new GeminiService(apiKey);
  return service.chatWithExpert(history, message, modelName);
};
