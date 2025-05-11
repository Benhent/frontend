import { useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  BookOpen,
  Calendar,
  ChevronDown,
  Users,
  Briefcase,
  Cpu,
  Flask,
  Globe,
  ExternalLink,
  ArrowRight,
  Search,
  FileText,
  Mail,
  Phone,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import { Separator } from "../../../components/ui/separator"

const Dashboard = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      {/* Hero Section */}
      <HeroSection />

      {/* Quick Actions */}
      <QuickActions />

      {/* Latest Articles */}
      <LatestArticles />

      {/* Research Areas */}
      <ResearchAreas />

      {/* Contact Section */}
      <ContactSection />
    </div>
  )
}

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary/90 to-primary py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container relative z-10"
      >
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Badge className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm">
              Tạp chí Khoa học Lạc Hồng
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Nền tảng xuất bản và chia sẻ nghiên cứu khoa học
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-8 text-lg text-white/90"
          >
            Tạp chí đa ngành với sứ mệnh công bố các kết quả nghiên cứu khoa học thuộc lĩnh vực đào tạo, 
            giảng dạy của Trường Đại học Lạc Hồng và cộng đồng khoa học.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate("/post-article")}
            >
              Gửi bài báo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate("/article")}
            >
              Xem bài báo
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

const QuickActions = () => {
  const controls = useAnimation()
  const inView = useInView({ once: true, threshold: 0.2 })

  useEffect(() => {
    if (inView) {
      controls.start((i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1 },
      }))
    }
  }, [inView, controls])

  const actions = [
    {
      title: "Gửi bài báo",
      description: "Hướng dẫn chi tiết quy trình gửi bài",
      icon: FileText,
      link: "/post-article",
    },
    {
      title: "Tìm kiếm",
      description: "Tra cứu bài báo theo chủ đề",
      icon: Search,
      link: "/article",
    },
    {
      title: "Liên hệ",
      description: "Thông tin liên hệ Ban biên tập",
      icon: Mail,
      link: "/contact",
    },
  ]

  return (
    <section className="py-16">
      <div className="container">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action, i) => (
            <motion.div
              key={action.title}
              custom={i}
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
            >
              <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                    <action.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                  <Button
                    variant="ghost"
                    className="mt-4 w-full justify-between"
                    onClick={() => navigate(action.link)}
                  >
                    Xem thêm
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const LatestArticles = () => {
  const controls = useAnimation()
  const inView = useInView({ once: true, threshold: 0.2 })

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 })
    }
  }, [inView, controls])

  return (
    <section className="bg-muted/50 py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          className="mb-10 text-center"
        >
          <Badge className="mb-4">Bài báo mới</Badge>
          <h2 className="mb-4 text-3xl font-bold">Bài báo mới xuất bản</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Các bài báo mới nhất đã được xuất bản trên Tạp chí Khoa học Lạc Hồng
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder articles - replace with real data */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group cursor-pointer transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-muted">
                    <div className="h-full w-full bg-muted" />
                  </div>
                  <Badge variant="outline" className="mb-2">
                    Khoa học công nghệ
                  </Badge>
                  <h3 className="mb-2 line-clamp-2 font-semibold">
                    Nghiên cứu và phát triển hệ thống IoT trong nông nghiệp thông minh
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    Ứng dụng công nghệ IoT trong việc giám sát và điều khiển tự động các thông số môi trường...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </span>
                    <Button variant="ghost" size="sm">
                      Đọc thêm
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button onClick={() => navigate("/article")}>
            Xem tất cả bài báo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

const ResearchAreas = () => {
  const controls = useAnimation()
  const inView = useInView({ once: true, threshold: 0.2 })

  useEffect(() => {
    if (inView) {
      controls.start((i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1 },
      }))
    }
  }, [inView, controls])

  const areas = [
    {
      icon: Briefcase,
      title: "Kinh tế",
      description: "Quản trị kinh doanh, Tài chính, Marketing",
    },
    {
      icon: Cpu,
      title: "Công nghệ",
      description: "Công nghệ thông tin, Tự động hóa, IoT",
    },
    {
      icon: Flask,
      title: "Hóa - Dược",
      description: "Dược phẩm, Công nghệ Hóa học",
    },
    {
      icon: Globe,
      title: "Xã hội",
      description: "Văn hóa, Ngôn ngữ, Giáo dục",
    },
  ]

  return (
    <section className="py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          className="mb-10 text-center"
        >
          <Badge className="mb-4">Lĩnh vực nghiên cứu</Badge>
          <h2 className="mb-4 text-3xl font-bold">Các lĩnh vực chính</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Tạp chí Khoa học Lạc Hồng chấp nhận các bài báo thuộc nhiều lĩnh vực khác nhau
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((area, i) => (
            <motion.div
              key={area.title}
              custom={i}
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
            >
              <Card className="group cursor-pointer transition-all hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                    <area.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold">{area.title}</h3>
                  <p className="text-sm text-muted-foreground">{area.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const ContactSection = () => {
  const controls = useAnimation()
  const inView = useInView({ once: true, threshold: 0.2 })

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 })
    }
  }, [inView, controls])

  return (
    <section className="bg-muted/50 py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge className="mb-4">Liên hệ</Badge>
          <h2 className="mb-4 text-3xl font-bold">Liên hệ với Ban biên tập</h2>
          <p className="mb-8 text-muted-foreground">
            Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">tapchi@lhu.edu.vn</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Điện thoại</p>
                  <p className="text-sm text-muted-foreground">(0251) 3951 777</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button className="mt-8" size="lg" onClick={() => navigate("/contact")}>
            Liên hệ ngay
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default Dashboard